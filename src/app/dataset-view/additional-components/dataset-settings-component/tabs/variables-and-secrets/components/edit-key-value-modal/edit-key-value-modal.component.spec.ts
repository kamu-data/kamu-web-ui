/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { mockListEnvVariablesQuery } from "@api/mock/environment-variables-and-secrets.mock";

import { EditKeyValueModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/components/edit-key-value-modal/edit-key-value-modal.component";
import { EditKeyValueModalHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/components/edit-key-value-modal/edit-key-value-modal.harness";
import { DatasetEnvironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-environment-variables.service";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("EditKeyValueModalComponent", () => {
    let component: EditKeyValueModalComponent;
    let fixture: ComponentFixture<EditKeyValueModalComponent>;
    let evnironmentVariablesService: DatasetEnvironmentVariablesService;

    const existingVariables = requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName).envVars.listEnvVariables;

    async function openForAdding(variables = existingVariables): Promise<EditKeyValueModalHarness> {
        vi.spyOn(evnironmentVariablesService, "listEnvVariables").mockReturnValue(of(variables));
        setComponentInput(fixture, "row", null);
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, EditKeyValueModalHarness);
    }

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
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should require a key", async () => {
        const modal = await openForAdding();

        await modal.setKey("");

        expect(await modal.getKeyError()).toBe("Key is required");
        expect(await modal.isSaveDisabled()).toBe(true);
    });

    ["failed key", "A-B", "2KEY", "KÉY"].forEach((key) => {
        it(`should reject the key "${key}", which kamu-cli does not accept`, async () => {
            const modal = await openForAdding();

            await modal.setKey(key);

            expect(await modal.getKeyError()).toBe(
                "Key may only contain letters, digits and underscores, and can't start with a digit",
            );
        });
    });

    it("should reject a key the dataset has already, instead of overwriting it", async () => {
        const firstVariable = requireValue(existingVariables.nodes[0]);
        const modal = await openForAdding({
            ...structuredClone(existingVariables),
            nodes: [{ ...firstVariable, key: "API_KEY" }],
        });

        await modal.setKey("API_KEY");

        expect(await modal.getKeyError()).toBe("Key already exists");
        expect(await modal.isSaveDisabled()).toBe(true);
    });

    it("should load the existing keys only when adding", () => {
        const listSpy = vi.spyOn(evnironmentVariablesService, "listEnvVariables");
        setComponentInput(fixture, "row", requireValue(existingVariables.nodes[0]));
        fixture.detectChanges();

        expect(listSpy).not.toHaveBeenCalled();
    });

    it("should require a value and limit it to 16 KiB", async () => {
        const modal = await openForAdding();

        await modal.touchValue();
        expect(await modal.getValueError()).toBe("Value is required");

        await modal.setValue("v".repeat(16 * 1024 + 1));
        expect(await modal.getValueError()).toBe("Value can't exceed 16384 characters");
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

    it("should save a new variable", async () => {
        const upsertSpy = vi.spyOn(evnironmentVariablesService, "upsertEnvVariable").mockReturnValue(of());
        const modal = await openForAdding();

        await modal.setKey("API_KEY");
        await modal.setValue("value-1");
        expect(await modal.isSaveDisabled()).toBe(false);
        await modal.save();

        expect(upsertSpy).toHaveBeenCalledWith(expect.objectContaining({ key: "API_KEY", value: "value-1" }));
    });

    it("should check edit new variable", () => {
        const evnironmentVariablesServiceSpy = vi
            .spyOn(evnironmentVariablesService, "upsertEnvVariable")
            .mockReturnValue(of());
        setComponentInput(
            fixture,
            "row",
            requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables.nodes[0]),
        );
        fixture.detectChanges();
        component.onEditRow();

        expect(evnironmentVariablesServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check fetch exposed value", () => {
        setComponentInput(
            fixture,
            "row",
            requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables.nodes[2]),
        );
        const exposedEnvVariableValueSpy = vi
            .spyOn(evnironmentVariablesService, "exposedEnvVariableValue")
            .mockReturnValue(of("exposed-value"));
        fixture.detectChanges();

        expect(exposedEnvVariableValueSpy).toHaveBeenCalledTimes(1);
    });

    it("should check 'key' control has 'readonly' attribute", async () => {
        setComponentInput(fixture, "row", requireValue(existingVariables.nodes[1]));
        fixture.detectChanges();
        const modal = await TestbedHarnessEnvironment.harnessForFixture(fixture, EditKeyValueModalHarness);

        expect(await modal.isKeyReadonly()).toBe(true);
    });
});
