/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PrepareStepComponent } from "./prepare-step.component";
import { FormGroupDirective } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { formGroupDirective } from "../base-step/base-step.component.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockSetPollingSourceEventYaml } from "../../../set-transform/mock.data";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import {
    DecompressFormat,
    PrepareKind,
    SetPollingSourceSection,
} from "../../add-polling-source/add-polling-source-form.types";

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
