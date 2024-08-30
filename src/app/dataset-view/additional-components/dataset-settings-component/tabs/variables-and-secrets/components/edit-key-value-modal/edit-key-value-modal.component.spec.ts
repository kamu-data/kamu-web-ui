import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EditKeyValueModalComponent } from "./edit-key-value-modal.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { findElementByDataTestId, setFieldValue } from "src/app/common/base-test.helpers.spec";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { DatasetEvnironmentVariablesService } from "src/app/services/dataset-evnironment-variables.service";
import { of } from "rxjs";
import { mockListEnvVariablesQuery } from "src/app/api/mock/environment-variables-and-secrets.mock";
import { ViewDatasetEnvVar } from "src/app/api/kamu.graphql.interface";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

describe("EditKeyValueModalComponent", () => {
    let component: EditKeyValueModalComponent;
    let fixture: ComponentFixture<EditKeyValueModalComponent>;
    let evnironmentVariablesService: DatasetEvnironmentVariablesService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditKeyValueModalComponent],
            providers: [
                NgbActiveModal,
                FormBuilder,
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return 2;
                                    }
                                },
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ToastrModule.forRoot(),
                MatCheckboxModule,
                FormsModule,
                ReactiveFormsModule,
                MatDividerModule,
                MatIconModule,
                MatTooltipModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditKeyValueModalComponent);
        evnironmentVariablesService = TestBed.inject(DatasetEvnironmentVariablesService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check display error messages for key", () => {
        component.row = null;
        fixture.detectChanges();
        setFieldValue(fixture, "key", "");
        fixture.detectChanges();
        const errorKeyReduiredMessage = findElementByDataTestId(fixture, "error-key-required");
        expect(errorKeyReduiredMessage?.textContent?.trim()).toEqual("The key is required");

        setFieldValue(fixture, "key", "failed key");
        fixture.detectChanges();
        const errorKeyWhitespaceMessage = findElementByDataTestId(fixture, "error-key-whitespace");
        expect(errorKeyWhitespaceMessage?.textContent?.trim()).toEqual("The key cannot contain spaces");

        setFieldValue(fixture, "key", "t".repeat(201));
        fixture.detectChanges();
        const errorKeyMaxLengthMessage = findElementByDataTestId(fixture, "error-key-maxLength");
        expect(errorKeyMaxLengthMessage?.textContent?.trim()).toEqual("Max length 200 characters");
    });

    it("should check toggle exposed value if exist", () => {
        component.exposedValue = "mock-value";
        component.toggleExposedValue();

        expect(component.isShowExposedValue).toEqual(true);
        expect(component.keyValueForm.controls.value.value).toEqual("mock-value");
    });

    it("should check toggle exposed value if not exist", () => {
        component.exposedValue = "";
        component.toggleExposedValue();

        expect(component.isShowExposedValue).toEqual(true);
        expect(component.keyValueForm.controls.value.value).toEqual("");
    });

    it("should check add new variable", () => {
        const evnironmentVariablesServiceSpy = spyOn(evnironmentVariablesService, "saveEnvVariable").and.returnValue(
            of(),
        );
        component.row = null;
        fixture.detectChanges();
        setFieldValue(fixture, "key", "key-1");
        fixture.detectChanges();
        setFieldValue(fixture, "value", "value-1");
        fixture.detectChanges();

        component.onEditRow();

        expect(evnironmentVariablesServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check edit new variable", () => {
        const evnironmentVariablesServiceSpy = spyOn(evnironmentVariablesService, "modifyEnvVariable").and.returnValue(
            of(),
        );
        component.row = mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables
            .nodes[0] as ViewDatasetEnvVar;
        fixture.detectChanges();
        component.onEditRow();

        expect(evnironmentVariablesServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check fetch exposed value", () => {
        component.row = mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables
            .nodes[2] as ViewDatasetEnvVar;
        const exposedEnvVariableValueSpy = spyOn(
            evnironmentVariablesService,
            "exposedEnvVariableValue",
        ).and.returnValue(of("exposed-value"));
        fixture.detectChanges();

        expect(exposedEnvVariableValueSpy).toHaveBeenCalledTimes(1);
    });
});
