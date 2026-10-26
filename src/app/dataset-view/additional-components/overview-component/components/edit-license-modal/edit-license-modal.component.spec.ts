/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { requireValue } from "@common/helpers/app.helpers";
import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    getInputElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewWithSetLicense,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EditLicenseModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/edit-license-modal/edit-license-modal.component";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";

describe("EditLicenseModalComponent", () => {
    let component: EditLicenseModalComponent;
    let fixture: ComponentFixture<EditLicenseModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EditLicenseModalComponent],
            providers: [Apollo, NgbActiveModal, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(EditLicenseModalComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(fixture, "currentState", {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewWithSetLicense,
            size: mockOverviewDataUpdate.size,
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initialize form", () => {
        const license = requireValue(mockOverviewWithSetLicense.metadata.currentLicense ?? null);
        expect(component.licenseForm.controls.name.value).toBe(license.name);
        expect(component.licenseForm.controls.shortName.value).toBe(license.shortName);
        expect(component.licenseForm.controls.websiteUrl.value).toBe(license.websiteUrl);
        expect(component.licenseForm.controls.spdxId.value).toBe(license.spdxId ?? null);
    });

    it("should check call onEditLicense", () => {
        const onEditLicenseSpy = vi.spyOn(component, "onEditLicense").mockImplementation(() => {});

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
        expect(component.licenseForm.valid).toBe(false);
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
