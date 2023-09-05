import { SharedTestModule } from "./../../../common/shared-test.module";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { SettingsTabComponent } from "./settings.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { DatasetSettingsService } from "./services/dataset-settings.service";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId, findInputElememtByDataTestId } from "src/app/common/base-test.helpers.spec";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";
import { ModalService } from "src/app/components/modal/modal.service";

describe("SettingsTabComponent", () => {
    let component: SettingsTabComponent;
    let fixture: ComponentFixture<SettingsTabComponent>;
    let datasetSettingsService: DatasetSettingsService;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SettingsTabComponent],
            providers: [Apollo],
            imports: [
                ReactiveFormsModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                ApolloModule,
                ApolloTestingModule,
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsTabComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        datasetSettingsService = TestBed.inject(DatasetSettingsService);
        modalService = TestBed.inject(ModalService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init renameError", fakeAsync(() => {
        const errorMessage = "Dataset is already exist.";
        datasetSettingsService.errorRenameDatasetChanges(errorMessage);
        tick();
        fixture.detectChanges();
        const elemInput = findInputElememtByDataTestId(fixture, "rename-dataset-input");
        expect(elemInput).toHaveClass("error-border-color");
        flush();
    }));

    it("should check rename dataset", () => {
        const renameDatasetSpy = spyOn(datasetSettingsService, "renameDataset").and.returnValue(of());
        emitClickOnElementByDataTestId(fixture, "rename-dataset-button");
        expect(renameDatasetSpy).toHaveBeenCalledTimes(1);
    });

    it("should check renameError is empty", fakeAsync(() => {
        const errorMessage = "Dataset is already exist.";
        datasetSettingsService.errorRenameDatasetChanges(errorMessage);
        const input = findInputElememtByDataTestId(fixture, "rename-dataset-input");
        input.value = "newDatasetName";
        input.dispatchEvent(new Event("keyup"));
        tick();
        fixture.detectChanges();
        expect(input).not.toHaveClass("error-border-color");
        flush();
    }));

    it("should check modal window is show", () => {
        const modalServiceSpy = spyOn(modalService, "error").and.callThrough();
        emitClickOnElementByDataTestId(fixture, "delete-dataset-button");
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
    });
});
