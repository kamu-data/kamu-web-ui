/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroupDirective } from "@angular/forms";

import { Apollo } from "apollo-angular";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { MaybeNull } from "@interface/app.types";

import { mockSetPollingSourceEventYaml } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    DecompressFormat,
    PrepareKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { createSourceEventFormGroupDirective } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.mock";
import { PrepareStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component";

describe("PrepareStepComponent", () => {
    let component: PrepareStepComponent;
    let fixture: ComponentFixture<PrepareStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, { provide: FormGroupDirective, useFactory: createSourceEventFormGroupDirective }],
            imports: [SharedTestModule, PrepareStepComponent],
        }).compileComponents();
    });

    function createComponent(eventYamlByHash: MaybeNull<string>): void {
        fixture = TestBed.createComponent(PrepareStepComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "sectionName", SetPollingSourceSection.PREPARE);
        setComponentInput(fixture, "eventYamlByHash", eventYamlByHash);
        fixture.detectChanges();
    }

    describe("editing an existing event", () => {
        beforeEach(() => createComponent(mockSetPollingSourceEventYaml));

        it("should load the prepare steps from the event", () => {
            expect(component.sectionForm.value).toEqual([
                { kind: PrepareKind.PIPE, command: "jq -c .result[]" },
                { kind: PrepareKind.DECOMPRESS, format: "zip", subPath: null },
            ]);
        });
    });

    describe("editing an event with a step of an unknown kind", () => {
        beforeEach(() =>
            createComponent(
                mockSetPollingSourceEventYaml.replace(
                    "    - kind: Pipe\n",
                    "    - kind: Unknown\n      value: 1\n    - kind: Pipe\n",
                ),
            ),
        );

        it("should load only the steps of known kinds", () => {
            expect(component.sectionForm.value).toEqual([
                { kind: PrepareKind.PIPE, command: "jq -c .result[]" },
                { kind: PrepareKind.DECOMPRESS, format: "zip", subPath: null },
            ]);
        });
    });

    describe("starting without steps", () => {
        beforeEach(() => createComponent(null));

        it("should start with no steps", () => {
            expect(component.sectionForm.length).toEqual(0);
        });

        it("should add and delete a pipe step", () => {
            emitClickOnElementByDataTestId(fixture, "add-pipe");
            fixture.detectChanges();
            expect(component.sectionForm.length).toEqual(1);

            emitClickOnElementByDataTestId(fixture, "remove-item-0");
            expect(component.sectionForm.length).toEqual(0);
        });

        it("should add a decompress step and move it down", () => {
            const decompress = {
                kind: PrepareKind.DECOMPRESS,
                format: DecompressFormat.ZIP,
                subPath: "",
            };
            emitClickOnElementByDataTestId(fixture, "add-decompress");
            emitClickOnElementByDataTestId(fixture, "add-pipe");
            fixture.detectChanges();
            expect(component.sectionForm.at(0).value).toEqual(decompress);

            emitClickOnElementByDataTestId(fixture, "move-down-item-0");
            expect(component.sectionForm.at(1).value).toEqual(decompress);
        });
    });
});
