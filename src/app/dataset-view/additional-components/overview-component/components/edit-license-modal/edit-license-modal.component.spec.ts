import { ApolloTestingModule } from "apollo-angular/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import {
    DatasetOverviewFragment,
    DatasetDataSizeFragment,
} from "src/app/api/kamu.graphql.interface";
import {
    emitClickOnElement,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import {
    mockMetadataSchemaUpdate,
    mockOverviewDataUpdate,
    mockOverviewWithSetLicense,
} from "../../../data-tabs.mock";
import { EditLicenseModalComponent } from "./edit-license-modal.component";

describe("EditLicenseModalComponent", () => {
    let component: EditLicenseModalComponent;
    let fixture: ComponentFixture<EditLicenseModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditLicenseModalComponent],
            imports: [ApolloTestingModule, FormsModule, ReactiveFormsModule],
            providers: [Apollo, NgbActiveModal],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(EditLicenseModalComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        component.currentState = {
            schema: mockMetadataSchemaUpdate.schema,
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
        expect(component.licenseForm.controls.name.value).toBe(
            mockOverviewWithSetLicense.metadata.currentLicense.name,
        );
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
        const onEditLicenseSpy = spyOn(
            component,
            "onEditLicense",
        ).and.callThrough();

        emitClickOnElement(fixture, '[data-test-id="save-license"]');
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
        const inputEl: HTMLInputElement = findElementByDataTestId(
            fixture,
            `license-websiteUrl`,
        ) as HTMLInputElement;
        const focusEvent = new InputEvent("focus");
        inputEl.dispatchEvent(focusEvent);
        fixture.detectChanges();

        const blurEvent = new InputEvent("blur");
        inputEl.dispatchEvent(blurEvent);
        fixture.detectChanges();

        const errorSpan = findElementByDataTestId(fixture, `error-url-format`);
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
            const inputEl: HTMLInputElement = findElementByDataTestId(
                fixture,
                `license-${controlName}`,
            ) as HTMLInputElement;

            const focusEvent = new InputEvent("focus");
            inputEl.dispatchEvent(focusEvent);
            fixture.detectChanges();

            const blurEvent = new InputEvent("blur");
            inputEl.dispatchEvent(blurEvent);
            fixture.detectChanges();

            const errorSpan = findElementByDataTestId(
                fixture,
                `error-license-${controlName}`,
            );
            expect(errorSpan.innerText).toBeDefined();
        });
    });
});