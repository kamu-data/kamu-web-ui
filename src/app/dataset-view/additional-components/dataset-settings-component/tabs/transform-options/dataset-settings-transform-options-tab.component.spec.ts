/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsTransformOptionsTabComponent } from "./dataset-settings-transform-options-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetSettingsTransformOptionsTabData } from "./dataset-settings-transform-options-tab.data";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { HarnessLoader } from "@angular/cdk/testing";
import { TransformTriggerFormHarness } from "./transform-trigger-form/transform-trigger-form.harness";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { getElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { FlowTriggerBreakingChangeRule, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { BatchingRuleType } from "../../dataset-settings.model";

describe("DatasetSettingsTransformOptionsTabComponent", () => {
    let component: DatasetSettingsTransformOptionsTabComponent;
    let fixture: ComponentFixture<DatasetSettingsTransformOptionsTabComponent>;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    let loader: HarnessLoader;
    let transformTriggerFormHarness: TransformTriggerFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [ApolloTestingModule, SharedTestModule, DatasetSettingsTransformOptionsTabComponent],
        });

        fixture = TestBed.createComponent(DatasetSettingsTransformOptionsTabComponent);
        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);

        component = fixture.componentInstance;
        component.transformTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            reactive: null,
            paused: true,
        } as DatasetSettingsTransformOptionsTabData;

        fixture.detectChanges();
        await fixture.whenStable();

        loader = TestbedHarnessEnvironment.loader(fixture);
        transformTriggerFormHarness = await loader.getHarness(TransformTriggerFormHarness);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(transformTriggerFormHarness).toBeTruthy();
    });

    function getSaveButton(): HTMLButtonElement {
        return getElementByDataTestId(fixture, "save-btn") as HTMLButtonElement;
    }

    it("should check 'Save' button is enabled with no reactive rule is defined", () => {
        expect(component.form.status).toBe("VALID");

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();
    });

    it("should check form is valid when loaded with no reactive rule defined", async () => {
        component.transformTabData.reactive = null;
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domTransformTriggerFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domTransformTriggerFormValue).toEqual({
            updatesEnabled: false,
            forNewData: {
                batchingRuleType: BatchingRuleType.IMMEDIATE,
                buffering: undefined,
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
        });
    });

    it("should check form is valid when loaded with buffering batching rule", async () => {
        component.transformTabData.paused = false;
        component.transformTabData.reactive = {
            forNewData: {
                __typename: "FlowTriggerBatchingRuleBuffering",
                minRecordsToAwait: 10,
                maxBatchingInterval: {
                    every: 5,
                    unit: TimeUnit.Minutes,
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domTransformTriggerFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domTransformTriggerFormValue).toEqual({
            updatesEnabled: true,
            forNewData: {
                batchingRuleType: BatchingRuleType.BUFFERING,
                buffering: {
                    minRecordsToAwait: 10,
                    maxBatchingInterval: {
                        every: 5,
                        unit: TimeUnit.Minutes,
                    },
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        });
        expect(component.form.getRawValue()).toEqual({
            transformTrigger: {
                updatesEnabled: true,
                forNewData: {
                    batchingRuleType: BatchingRuleType.BUFFERING,
                    buffering: {
                        minRecordsToAwait: 10,
                        maxBatchingInterval: {
                            every: 5,
                            unit: TimeUnit.Minutes,
                        },
                    },
                },
                forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
            },
        });
    });

    it("should check form is valid when loaded with immediate batching rule", async () => {
        component.transformTabData.paused = false;
        component.transformTabData.reactive = {
            forNewData: {
                __typename: "FlowTriggerBatchingRuleImmediate",
                dummy: true,
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domTransformTriggerFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domTransformTriggerFormValue).toEqual({
            updatesEnabled: true,
            forNewData: {
                batchingRuleType: BatchingRuleType.IMMEDIATE,
                buffering: undefined,
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
        });
        expect(component.form.getRawValue()).toEqual({
            transformTrigger: {
                updatesEnabled: true,
                forNewData: {
                    batchingRuleType: BatchingRuleType.IMMEDIATE,
                    buffering: {
                        minRecordsToAwait: null,
                        maxBatchingInterval: {
                            every: null,
                            unit: null,
                        },
                    },
                },
                forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
            },
        });
    });

    it("should check 'Save' button works with buffering batching rule", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        await transformTriggerFormHarness.enableUpdates();
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);
        await transformTriggerFormHarness.enterBufferingBatchingRule(10, { every: 5, unit: TimeUnit.Minutes });
        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.Recover);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                paused: false,
                triggerInput: {
                    reactive: {
                        forNewData: {
                            buffering: {
                                minRecordsToAwait: 10,
                                maxBatchingInterval: {
                                    every: 5,
                                    unit: TimeUnit.Minutes,
                                },
                            },
                        },
                        forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
                    },
                },
            }),
        );
    });

    it("should check 'Save' button works for with immediate batching rule", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        await transformTriggerFormHarness.enableUpdates();
        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.IMMEDIATE);
        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.NoAction);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                paused: false,
                triggerInput: {
                    reactive: {
                        forNewData: {
                            immediate: {
                                dummy: true,
                            },
                        },
                        forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
                    },
                },
            }),
        );
    });

    it("should check 'Save' button works for disabling updates", async () => {
        const setDatasetFlowTriggersSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTriggers").and.callThrough();

        await transformTriggerFormHarness.disableUpdates();

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                paused: true,
            }),
        );
    });
});
