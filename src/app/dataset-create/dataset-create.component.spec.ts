import { Observable } from "rxjs";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloModule } from "apollo-angular";
import { DatasetCreateComponent } from "./dataset-create.component";
import { AppDatasetCreateService } from "./dataset-create.service";

describe("DatasetCreateComponent", () => {
    let component: DatasetCreateComponent;
    let fixture: ComponentFixture<DatasetCreateComponent>;
    let datasetCreateService: AppDatasetCreateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetCreateComponent],
            imports: [ReactiveFormsModule, ApolloModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideComponent(DatasetCreateComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(DatasetCreateComponent);
        component = fixture.componentInstance;
        datasetCreateService = TestBed.inject(AppDatasetCreateService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check error message in the ngOnInit", () => {
        const errorMessage = "testMessage";
        expect(component.errorMessage).toBe("");
        datasetCreateService.errorMessageChanges(errorMessage);
        component.ngOnInit();
        expect(component.errorMessage).toBe(errorMessage);
    });

    it("should check getter isFormValid()", () => {
        component.yamlTemplate = "testYaml";
        fixture.detectChanges();
        expect(component.isFormValid).toBeTrue();
    });

    it("should check call createDatasetFromForm()", () => {
        const createDatasetFromFormSpy = spyOn(
            datasetCreateService,
            "createEmptyDataset",
        ).and.returnValue(new Observable());

        component.onCreateDataset();

        expect(createDatasetFromFormSpy).toHaveBeenCalledTimes(1);
    });

    it("should check call createDatasetFromSnapshot()", () => {
        component.showMonacoEditor = true;
        component.yamlTemplate = "test template";
        const createDatasetFromSnapshotSpy = spyOn(
            datasetCreateService,
            "createDatasetFromSnapshot",
        ).and.returnValue(new Observable());

        component.onCreateDataset();

        expect(createDatasetFromSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it("should check switch checkbox `Initialize from YAML snapshot`)", () => {
        const checkboxInput = findElementByDataTestId(
            fixture,
            "show-monaco-editor",
        ) as HTMLInputElement;
        expect(checkboxInput.checked).toBeFalse();
        expect(component.showMonacoEditor).toBeFalse();

        checkboxInput.click();

        expect(checkboxInput.checked).toBeTrue();
        expect(component.showMonacoEditor).toBeTrue();

        checkboxInput.click();

        expect(checkboxInput.checked).toBeFalse();
        expect(component.showMonacoEditor).toBeFalse();
    });

    it("should check call uploadFile when file picked)", async () => {
        const checkboxInput = findElementByDataTestId(
            fixture,
            "show-monaco-editor",
        ) as HTMLInputElement;

        checkboxInput.click();
        fixture.detectChanges();

        const mockFile = new File(["test content"], "test.yaml", {
            type: "text/html",
        });
        const mockEvt = { target: { files: [mockFile] } };
        try {
            const result = await component.onFileSelected(
                mockEvt as unknown as Event,
            );
            expect(result).toBe("# You can edit this file\ntest content");
        } catch (error) {
            console.log(error);
        }
    });

    it("should check call uploadFile when file not picked)", async () => {
        const checkboxInput = findElementByDataTestId(
            fixture,
            "show-monaco-editor",
        ) as HTMLInputElement;

        checkboxInput.click();
        fixture.detectChanges();

        const mockEvt = { target: { files: [] } };
        try {
            const result = await component.onFileSelected(
                mockEvt as unknown as Event,
            );
            expect(result).toBe("");
        } catch (error) {
            console.log(error);
        }
    });

    [
        { datasetName: "test.test", valid: true },
        { datasetName: "t-test.test", valid: true },
        { datasetName: "test.t-test", valid: true },
        { datasetName: "t-test.t-test", valid: true },
        { datasetName: "-test.test", valid: false },
        { datasetName: "test.-tests", valid: false },
        { datasetName: "test.", valid: false },
        { datasetName: ".test", valid: false },
        { datasetName: "", valid: false },
    ].forEach((item: { datasetName: string; valid: boolean }) => {
        it(`should check valid form with datasetName=${item.datasetName}`, () => {
            component.createDatasetForm.patchValue({
                datasetName: item.datasetName,
            });
            fixture.detectChanges();
            expect(component.createDatasetForm.valid).toBe(item.valid);
        });
    });
});
