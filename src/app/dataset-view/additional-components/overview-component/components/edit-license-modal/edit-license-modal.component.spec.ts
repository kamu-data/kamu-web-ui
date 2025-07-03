/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { DatasetOverviewFragment, DatasetDataSizeFragment } from "src/app/api/kamu.graphql.interface";
import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    getInputElementByDataTestId,
} from "src/app/common/helpers/base-test.helpers.spec";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate, mockOverviewWithSetLicense } from "../../../data-tabs.mock";
import { EditLicenseModalComponent } from "./edit-license-modal.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("EditLicenseModalComponent", () => {
    let component: EditLicenseModalComponent;
    let fixture: ComponentFixture<EditLicenseModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, HttpClientTestingModule, EditLicenseModalComponent],
            providers: [Apollo, NgbActiveModal],
        }).compileComponents();

        fixture = TestBed.createComponent(EditLicenseModalComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.currentState = {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewWithSetLicense as DatasetOverviewFragment,
            size: mockOverviewDataUpdate.size as DatasetDataSizeFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initialize form", () => {
        component.ngOnInit();
        expect(component.licenseForm.controls.name.value).toBe(mockOverviewWithSetLicense.metadata.currentLicense.name);
        expect(component.licenseForm.controls.shortName.value).toBe(
            mockOverviewWithSetLicense.metadata.currentLicense.shortName,
        );
        expect(component.licenseForm.controls.websiteUrl.value).toBe(
            mockOverviewWithSetLicense.metadata.currentLicense.websiteUrl,
        );
        expect(component.licenseForm.controls.spdxId.value).toBe(
            mockOverviewWithSetLicense.metadata.currentLicense.spdxId,
        );
    });

    it("should check call onEditLicense", () => {
        const onEditLicenseSpy = spyOn(component, "onEditLicense").and.stub();

        emitClickOnElementByDataTestId(fixture, "save-license");
        expect(onEditLicenseSpy).toHaveBeenCalledTimes(1);
    });

    it("should check licenseForm is valid", () => {
        component.licenseForm.patchValue({
            name: "",
            shortName: "",
            websiteUrl: "",
        });
        fixture.detectChanges();
        expect(component.licenseForm.valid).toBeFalse();
    });

    it("should check validation url pattern", () => {
        component.licenseForm.patchValue({
            websiteUrl: "bad url",
        });
        const inputEl: HTMLInputElement = getInputElementByDataTestId(fixture, `license-websiteUrl`);
        const focusEvent = new InputEvent("focus");
        inputEl.dispatchEvent(focusEvent);
        fixture.detectChanges();

        const blurEvent = new InputEvent("blur");
        inputEl.dispatchEvent(blurEvent);
        fixture.detectChanges();

        const errorSpan = getElementByDataTestId(fixture, `error-url-format`);
        expect(errorSpan.innerText).toBe("Url format is wrong");
    });

    it("should check validation messages are visible", () => {
        component.licenseForm.patchValue({
            name: "",
            shortName: "",
            websiteUrl: "",
        });
        fixture.detectChanges();

        ["name", "shortName", "websiteUrl"].forEach((controlName: string) => {
            const inputEl: HTMLInputElement = getInputElementByDataTestId(fixture, `license-${controlName}`);

            const focusEvent = new InputEvent("focus");
            inputEl.dispatchEvent(focusEvent);
            fixture.detectChanges();

            const blurEvent = new InputEvent("blur");
            inputEl.dispatchEvent(blurEvent);
            fixture.detectChanges();

            const errorSpan = getElementByDataTestId(fixture, `error-license-${controlName}`);
            expect(errorSpan.innerText).toBeDefined();
        });
    });
});
