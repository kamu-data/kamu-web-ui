/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    getInputElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { DatasetDataSizeFragment, DatasetOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";

import { mockMetadataDerivedUpdate, mockOverviewDataUpdate, mockOverviewWithSetLicense } from "../../../data-tabs.mock";
import { EditLicenseModalComponent } from "./edit-license-modal.component";

describe("EditLicenseModalComponent", () => {
    let component: EditLicenseModalComponent;
    let fixture: ComponentFixture<EditLicenseModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EditLicenseModalComponent],
            providers: [
                Apollo,
                NgbActiveModal,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
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

        const errorElement = getElementByDataTestId(fixture, `error-message-websiteUrl`);
        expect(errorElement.innerText).toBe("Url format is wrong");
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

            const errorElement = getElementByDataTestId(fixture, `error-message-${controlName}`);
            expect(errorElement.innerText).toBeDefined();
        });
    });
});
