/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroupDirective } from "@angular/forms";

import { Apollo } from "apollo-angular";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { mockSetPollingSourceEventYaml } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    DecompressFormat,
    PrepareKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { formGroupDirective } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component.spec";
import { PrepareStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component";

describe("PrepareStepComponent", () => {
    let component: PrepareStepComponent;
    let fixture: ComponentFixture<PrepareStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, { provide: FormGroupDirective, useValue: formGroupDirective }],
            imports: [SharedTestModule, PrepareStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PrepareStepComponent);
        component = fixture.componentInstance;
        component.sectionName = SetPollingSourceSection.PREPARE;
        component.eventYamlByHash = mockSetPollingSourceEventYaml;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add and delete item", () => {
        component.sectionForm.clear();
        expect(component.sectionForm.length).toEqual(0);
        emitClickOnElementByDataTestId(fixture, "add-pipe");
        expect(component.sectionForm.length).toEqual(1);
        emitClickOnElementByDataTestId(fixture, "remove-item-0");
        expect(component.sectionForm.length).toEqual(0);
    });

    it("should check add decompress", () => {
        const result = {
            kind: PrepareKind.DECOMPRESS,
            format: DecompressFormat.ZIP,
            subPath: "",
        };
        component.sectionForm.clear();
        expect(component.sectionForm.length).toEqual(0);
        emitClickOnElementByDataTestId(fixture, "add-decompress");
        emitClickOnElementByDataTestId(fixture, "add-pipe");
        expect(component.sectionForm.at(0).value).toEqual(result);

        emitClickOnElementByDataTestId(fixture, "move-down-item-0");

        expect(component.sectionForm.at(1).value).toEqual(result);
    });
});
