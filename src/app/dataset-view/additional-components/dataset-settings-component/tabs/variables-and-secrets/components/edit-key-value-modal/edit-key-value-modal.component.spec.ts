/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { findElementByDataTestId, setFieldValue } from "@common/helpers/base-test.helpers.spec";
import { ViewDatasetEnvVar } from "@api/kamu.graphql.interface";
import { mockListEnvVariablesQuery } from "@api/mock/environment-variables-and-secrets.mock";

import { EditKeyValueModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/components/edit-key-value-modal/edit-key-value-modal.component";
import { DatasetEnvironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-environment-variables.service";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("EditKeyValueModalComponent", () => {
    let component: EditKeyValueModalComponent;
    let fixture: ComponentFixture<EditKeyValueModalComponent>;
    let evnironmentVariablesService: DatasetEnvironmentVariablesService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideToastr(),
                NgbActiveModal,
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
            imports: [EditKeyValueModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditKeyValueModalComponent);
        evnironmentVariablesService = TestBed.inject(DatasetEnvironmentVariablesService);
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
        const errorKeyReduiredMessage = findElementByDataTestId(fixture, "error-key");
        expect(errorKeyReduiredMessage?.textContent?.trim()).toEqual("Key is required");

        setFieldValue(fixture, "key", "failed key");
        fixture.detectChanges();
        const errorKeyWhitespaceMessage = findElementByDataTestId(fixture, "error-key");
        expect(errorKeyWhitespaceMessage?.textContent?.trim()).toEqual("Key can't contain spaces");

        setFieldValue(fixture, "key", "t".repeat(201));
        fixture.detectChanges();
        const errorKeyMaxLengthMessage = findElementByDataTestId(fixture, "error-key");
        expect(errorKeyMaxLengthMessage?.textContent?.trim()).toEqual("Key can't exceed 200 characters");
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
        const evnironmentVariablesServiceSpy = spyOn(evnironmentVariablesService, "upsertEnvVariable").and.returnValue(
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
        const evnironmentVariablesServiceSpy = spyOn(evnironmentVariablesService, "upsertEnvVariable").and.returnValue(
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

    it("should check 'key' control has 'readonly' attribute", () => {
        component.row = mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables
            .nodes[1] as ViewDatasetEnvVar;

        fixture.detectChanges();
        const keyElement = findElementByDataTestId(fixture, "key");
        expect(keyElement?.hasAttribute("readonly")).toEqual(true);
    });
});
