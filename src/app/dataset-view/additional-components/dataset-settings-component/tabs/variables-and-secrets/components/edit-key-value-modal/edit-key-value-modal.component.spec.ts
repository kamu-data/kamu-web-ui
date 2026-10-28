/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { NEVER, of, Subject } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
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
        it(`should reject the key "${key}", which the backend does not accept`, async () => {
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

    it("should require a value and limit it to 16 KiB of UTF-8", async () => {
        const modal = await openForAdding();

        await modal.touchValue();
        expect(await modal.getValueError()).toBe("Value is required");

        await modal.setValue("v".repeat(16 * 1024));
        expect(await modal.getValueError()).toBeNull();

        await modal.setValue("é".repeat(8 * 1024 + 1));
        expect(await modal.getValueError()).toBe("Value can't exceed 16384 bytes");
    });

    it("should reject a key over 200 characters", async () => {
        const modal = await openForAdding();

        await modal.setKey("K".repeat(200));
        expect(await modal.getKeyError()).toBeNull();

        await modal.setKey("K".repeat(201));

        expect(await modal.getKeyError()).toBe("Key can't exceed 200 characters");
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

    it("should save a new variable and close", async () => {
        const upsertSpy = vi.spyOn(evnironmentVariablesService, "upsertEnvVariable").mockReturnValue(of(undefined));
        const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
        const modal = await openForAdding();

        await modal.setKey("API_KEY");
        await modal.setValue("value-1");
        expect(await modal.isSaveDisabled()).toBe(false);
        await modal.save();

        expect(upsertSpy).toHaveBeenCalledWith({
            accountId: mockDatasetBasicsRootFragment.owner.id,
            datasetId: mockDatasetBasicsRootFragment.id,
            key: "API_KEY",
            value: "value-1",
            isSecret: false,
        });
        expect(closeSpy).toHaveBeenCalledWith("Success");
    });

    it("should save a new secret with its value hidden", async () => {
        const upsertSpy = vi.spyOn(evnironmentVariablesService, "upsertEnvVariable").mockReturnValue(of(undefined));
        stubMethod(TestBed.inject(NgbActiveModal), "close");
        const modal = await openForAdding();

        await modal.setSecret(true);
        expect(await modal.isValueHidden()).toBe(true);
        await modal.setKey("API_TOKEN");
        await modal.setValue("s3cret");
        await modal.save();

        expect(upsertSpy).toHaveBeenCalledWith(expect.objectContaining({ key: "API_TOKEN", isSecret: true }));
    });

    it("should not save while the form is invalid", async () => {
        const upsertSpy = vi.spyOn(evnironmentVariablesService, "upsertEnvVariable");
        const modal = await openForAdding();

        await modal.setKey("A-B");
        await modal.setValue("value-1");
        await modal.save();

        expect(await modal.isSaveDisabled()).toBe(true);
        expect(upsertSpy).not.toHaveBeenCalled();
    });

    it("should keep Save disabled until the existing keys have loaded", async () => {
        const keys$ = new Subject<typeof existingVariables>();
        vi.spyOn(evnironmentVariablesService, "listEnvVariables").mockReturnValue(keys$);
        setComponentInput(fixture, "row", null);
        fixture.detectChanges();
        const modal = await TestbedHarnessEnvironment.harnessForFixture(fixture, EditKeyValueModalHarness);

        await modal.setKey("API_KEY");
        await modal.setValue("value-1");
        expect(await modal.isSaveDisabled()).toBe(true);

        keys$.next(existingVariables);
        expect(await modal.isSaveDisabled()).toBe(false);
    });

    it("should keep Save disabled while the variable is being saved", async () => {
        const upsertSpy = vi.spyOn(evnironmentVariablesService, "upsertEnvVariable").mockReturnValue(NEVER);
        const modal = await openForAdding();

        await modal.setKey("API_KEY");
        await modal.setValue("value-1");
        await modal.save();
        await modal.save();

        expect(await modal.isSaveDisabled()).toBe(true);
        expect(upsertSpy).toHaveBeenCalledTimes(1);
    });

    it("should fill the form from the variable being edited, with an empty value for a missing one", async () => {
        const row = { ...requireValue(existingVariables.nodes[0]), value: null };
        setComponentInput(fixture, "row", row);
        fixture.detectChanges();
        const modal = await TestbedHarnessEnvironment.harnessForFixture(fixture, EditKeyValueModalHarness);

        expect(await modal.getKey()).toBe("key-1");
        expect(await modal.getValue()).toBe("");
        expect(await modal.isSecretLocked()).toBe(false);
    });

    it("should save an edited variable under its key", async () => {
        const upsertSpy = vi.spyOn(evnironmentVariablesService, "upsertEnvVariable").mockReturnValue(of(undefined));
        stubMethod(TestBed.inject(NgbActiveModal), "close");
        setComponentInput(fixture, "row", { ...requireValue(existingVariables.nodes[0]), key: "API_KEY" });
        fixture.detectChanges();
        const modal = await TestbedHarnessEnvironment.harnessForFixture(fixture, EditKeyValueModalHarness);

        await modal.setValue("value-2");
        await modal.save();

        expect(upsertSpy).toHaveBeenCalledWith(
            expect.objectContaining({ key: "API_KEY", value: "value-2", isSecret: false }),
        );
    });

    it("should show the exposed value of a secret being edited, and keep it a secret", async () => {
        vi.spyOn(evnironmentVariablesService, "exposedEnvVariableValue").mockReturnValue(of("exposed-value"));
        setComponentInput(fixture, "row", requireValue(existingVariables.nodes[2]));
        fixture.detectChanges();
        const modal = await TestbedHarnessEnvironment.harnessForFixture(fixture, EditKeyValueModalHarness);

        expect(await modal.getValue()).toBe("exposed-value");
        expect(await modal.isSecretLocked()).toBe(true);
    });

    it("should forget the exposed value when it is hidden again", () => {
        component.exposedValue = "mock-value";
        component.toggleExposedValue();
        component.toggleExposedValue();

        expect(component.isShowExposedValue).toBe(false);
        expect(component.exposedValue).toBe("");
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
