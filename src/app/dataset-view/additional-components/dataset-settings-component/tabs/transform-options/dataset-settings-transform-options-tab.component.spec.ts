/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { FlowTriggerBreakingChangeRule, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

import { BatchingRuleType, FlowTriggerStopPolicyType } from "../../dataset-settings.model";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { FlowStopPolicyFormComponent } from "../shared/flow-stop-policy-form/flow-stop-policy-form.component";
import { FlowStopPolicyFormHarness } from "../shared/flow-stop-policy-form/flow-stop-policy-form.harness";
import { DatasetSettingsTransformOptionsTabComponent } from "./dataset-settings-transform-options-tab.component";
import { DatasetSettingsTransformOptionsTabData } from "./dataset-settings-transform-options-tab.data";
import { TransformTriggerFormHarness } from "./transform-trigger-form/transform-trigger-form.harness";

describe("DatasetSettingsTransformOptionsTabComponent", () => {
    let component: DatasetSettingsTransformOptionsTabComponent;
    let fixture: ComponentFixture<DatasetSettingsTransformOptionsTabComponent>;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    let loader: HarnessLoader;
    let transformTriggerFormHarness: TransformTriggerFormHarness;
    let stopPolicyFormHarness: FlowStopPolicyFormHarness;

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
            stopPolicy: null,
            paused: true,
        } as DatasetSettingsTransformOptionsTabData;

        fixture.detectChanges();
        await fixture.whenStable();

        loader = TestbedHarnessEnvironment.loader(fixture);
        transformTriggerFormHarness = await loader.getHarness(TransformTriggerFormHarness);
        stopPolicyFormHarness = await loader.getHarness(FlowStopPolicyFormHarness);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(transformTriggerFormHarness).toBeTruthy();
        expect(stopPolicyFormHarness).toBeTruthy();
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
        component.transformTabData.stopPolicy = {
            __typename: "FlowTriggerStopPolicyNever",
            dummy: false,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domTransformTriggerFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domTransformTriggerFormValue).toEqual({
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
            updatesEnabled: true,
            transformTrigger: {
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
            stopPolicy: {
                stopPolicyType: FlowTriggerStopPolicyType.NEVER,
                maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
            },
        });
    });

    it("should check time unit of day is converted into 24 hours", async () => {
        component.transformTabData.paused = false;
        component.transformTabData.reactive = {
            forNewData: {
                __typename: "FlowTriggerBatchingRuleBuffering",
                minRecordsToAwait: 10,
                maxBatchingInterval: {
                    every: 1,
                    unit: TimeUnit.Days, // This should be converted to 24 hours
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        };
        component.transformTabData.stopPolicy = {
            __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
            maxFailures: 3,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domTransformTriggerFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domTransformTriggerFormValue).toEqual({
            forNewData: {
                batchingRuleType: BatchingRuleType.BUFFERING,
                buffering: {
                    minRecordsToAwait: 10,
                    maxBatchingInterval: {
                        every: 24,
                        unit: TimeUnit.Hours,
                    },
                },
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
        });
        expect(component.form.getRawValue()).toEqual({
            updatesEnabled: true,
            transformTrigger: {
                forNewData: {
                    batchingRuleType: BatchingRuleType.BUFFERING,
                    buffering: {
                        minRecordsToAwait: 10,
                        maxBatchingInterval: {
                            every: 24,
                            unit: TimeUnit.Hours,
                        },
                    },
                },
                forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
            },
            stopPolicy: {
                stopPolicyType: FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES,
                maxFailures: 3,
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
        component.transformTabData.stopPolicy = {
            __typename: "FlowTriggerStopPolicyNever",
            dummy: false,
        };
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        const domTransformTriggerFormValue = await transformTriggerFormHarness.currentFormValue();
        expect(domTransformTriggerFormValue).toEqual({
            forNewData: {
                batchingRuleType: BatchingRuleType.IMMEDIATE,
                buffering: undefined,
            },
            forBreakingChange: FlowTriggerBreakingChangeRule.NoAction,
        });
        expect(component.form.getRawValue()).toEqual({
            updatesEnabled: true,
            transformTrigger: {
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
            stopPolicy: {
                stopPolicyType: FlowTriggerStopPolicyType.NEVER,
                maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
            },
        });
    });

    it("should check 'Save' button works with buffering batching rule", async () => {
        const setDatasetFlowTriggerSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTrigger").and.callThrough();

        component.form.controls.updatesEnabled.setValue(true);

        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.BUFFERING);
        await transformTriggerFormHarness.enterBufferingBatchingRule(10, { every: 5, unit: TimeUnit.Minutes });
        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.Recover);

        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES);
        await stopPolicyFormHarness.setMaxFailures(3);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggerSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerRuleInput: {
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
        const setDatasetFlowTriggerSpy = spyOn(datasetFlowTriggerService, "setDatasetFlowTrigger").and.callThrough();

        component.form.controls.updatesEnabled.setValue(true);

        await transformTriggerFormHarness.setSelectedBatchingRuleType(BatchingRuleType.IMMEDIATE);
        await transformTriggerFormHarness.setSelectedBreakingChangeRule(FlowTriggerBreakingChangeRule.NoAction);

        await stopPolicyFormHarness.setSelectedStopPolicyType(FlowTriggerStopPolicyType.NEVER);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetFlowTriggerSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerRuleInput: {
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

    it("should check 'Save' button works for disabling updates", () => {
        const pauseDatasetFlowTriggerSpy = spyOn(
            datasetFlowTriggerService,
            "pauseDatasetFlowTrigger",
        ).and.callThrough();

        component.form.controls.updatesEnabled.setValue(false);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(pauseDatasetFlowTriggerSpy).toHaveBeenCalledTimes(1);
    });
});
