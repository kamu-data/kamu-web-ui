import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { GeneralComponent } from "./general.component";
import { DatasetSettingsService } from "../../services/dataset-settings.service";
import { ModalService } from "../../../../../components/modal/modal.service";
import { ApolloModule } from "apollo-angular";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "../../../../../common/shared-test.module";
import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "../../../../../search/mock.data";
import _ from "lodash";
import { of } from "rxjs";
import {
    checkVisible,
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    getInputElememtByDataTestId,
} from "../../../../../common/base-test.helpers.spec";

describe("GeneralComponent", () => {
    let component: GeneralComponent;
    let fixture: ComponentFixture<GeneralComponent>;
    let datasetSettingsService: DatasetSettingsService;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GeneralComponent],
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                ApolloModule,
                ApolloTestingModule,
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment);

        datasetSettingsService = TestBed.inject(DatasetSettingsService);
        modalService = TestBed.inject(ModalService);
        fixture.detectChanges();
    });

    enum Elements {
        RenameDatasetButton = "rename-dataset-button",
        RenameDatasetInput = "rename-dataset-input",

        RenameDatasetErrorNameRequired = "rename-dataset-error-name-required",
        RenameDatasetErrorPattern = "rename-dataset-error-name-pattern",
        RenameDatasetErrorCustom = "rename-dataset-error-custom",

        DeleteDatasetButton = "delete-dataset-button",
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check default state of properties", () => {
        expect(component.isDeleteDatasetDisabled).toEqual(false);
        expect(component.renameDatasetForm.disabled).toEqual(false);
    });

    it("should check missing canDelete permission", () => {
        component.datasetPermissions.permissions.canDelete = false;
        fixture.detectChanges();

        expect(component.isDeleteDatasetDisabled).toEqual(true);
        expect(component.renameDatasetForm.disabled).toEqual(false);
    });

    it("should check missing rename permission", () => {
        component.datasetPermissions.permissions.canRename = false;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.isDeleteDatasetDisabled).toEqual(false);
        expect(component.renameDatasetForm.disabled).toEqual(true);
    });

    it("should check rename dataset", () => {
        const renameDatasetSpy = spyOn(datasetSettingsService, "renameDataset").and.returnValue(of());

        dispatchInputEvent(fixture, Elements.RenameDatasetInput, "someName");
        emitClickOnElementByDataTestId(fixture, Elements.RenameDatasetButton);

        expect(renameDatasetSpy).toHaveBeenCalledOnceWith(
            component.datasetBasics.owner.accountName,
            component.datasetBasics.id,
            "someName",
        );
        checkVisible(fixture, Elements.RenameDatasetErrorNameRequired, false);
        checkVisible(fixture, Elements.RenameDatasetErrorPattern, false);
        checkVisible(fixture, Elements.RenameDatasetErrorCustom, false);
    });

    it("should check init renameError", fakeAsync(() => {
        const errorMessage = "Dataset is already exist.";
        datasetSettingsService.emitRenameDatasetErrorOccurred(errorMessage);
        fixture.detectChanges();

        tick();

        const elemInput = getInputElememtByDataTestId(fixture, "rename-dataset-input");
        expect(elemInput).toHaveClass("error-border-color");

        checkVisible(fixture, Elements.RenameDatasetErrorNameRequired, false);
        checkVisible(fixture, Elements.RenameDatasetErrorPattern, false);
        checkVisible(fixture, Elements.RenameDatasetErrorCustom, true);

        flush();
    }));

    it("should check rename validation required", () => {
        const renameDatasetSpy = spyOn(component, "renameDataset").and.stub();

        dispatchInputEvent(fixture, Elements.RenameDatasetInput, "");
        emitClickOnElementByDataTestId(fixture, Elements.RenameDatasetButton);

        expect(renameDatasetSpy).not.toHaveBeenCalled();

        checkVisible(fixture, Elements.RenameDatasetErrorNameRequired, true);
        checkVisible(fixture, Elements.RenameDatasetErrorPattern, false);
        checkVisible(fixture, Elements.RenameDatasetErrorCustom, false);
    });

    it("should check rename validation pattern", () => {
        const renameDatasetSpy = spyOn(component, "renameDataset").and.stub();

        dispatchInputEvent(fixture, Elements.RenameDatasetInput, "#illegal#");
        emitClickOnElementByDataTestId(fixture, Elements.RenameDatasetButton);

        expect(renameDatasetSpy).not.toHaveBeenCalled();

        checkVisible(fixture, Elements.RenameDatasetErrorNameRequired, false);
        checkVisible(fixture, Elements.RenameDatasetErrorPattern, true);
        checkVisible(fixture, Elements.RenameDatasetErrorCustom, false);
    });

    it("should check renameError is empty after keyup", fakeAsync(() => {
        const errorMessage = "Dataset is already exist.";
        datasetSettingsService.emitRenameDatasetErrorOccurred(errorMessage);

        const renameDatasetInput = getInputElememtByDataTestId(fixture, Elements.RenameDatasetInput);
        renameDatasetInput.dispatchEvent(new Event("keyup"));
        fixture.detectChanges();

        tick();

        expect(renameDatasetInput).not.toHaveClass("error-border-color");
        flush();
    }));

    it("should check delete modal window is shown and sends API call after confirm", fakeAsync(() => {
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const deleteDatasetSpy = spyOn(datasetSettingsService, "deleteDataset").and.returnValue(of());

        emitClickOnElementByDataTestId(fixture, Elements.DeleteDatasetButton);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        fixture.detectChanges();

        tick();

        expect(deleteDatasetSpy).toHaveBeenCalledOnceWith(
            component.datasetBasics.owner.accountName,
            component.datasetBasics.id,
        );

        flush();
    }));

    it("should check delete modal window is shown and does not send API call after reject", fakeAsync(() => {
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        const deleteDatasetSpy = spyOn(datasetSettingsService, "deleteDataset").and.stub();

        emitClickOnElementByDataTestId(fixture, Elements.DeleteDatasetButton);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        fixture.detectChanges();

        tick();

        expect(deleteDatasetSpy).not.toHaveBeenCalled();

        flush();
    }));
});
