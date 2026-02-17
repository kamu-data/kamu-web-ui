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
import { FlowRetryBackoffType, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

import { DatasetFlowConfigService } from "../../services/dataset-flow-config.service";
import { DatasetSettingsIngestConfigurationTabComponent } from "./dataset-settings-ingest-configuration-tab.component";
import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form/flow-retry-policy-form.component";
import { FlowRetryPolicyFormHarness } from "./flow-retry-policy-form/flow-retry-policy-form.harness";
import { IngestConfigurationRuleFormHarness } from "./ingest-configuration-rule-form/ingest-configuration-rule-form.harness";

describe("DatasetSettingsIngestConfigurationTabComponent", () => {
    let component: DatasetSettingsIngestConfigurationTabComponent;
    let fixture: ComponentFixture<DatasetSettingsIngestConfigurationTabComponent>;
    let datasetFlowConfigService: DatasetFlowConfigService;

    let loader: HarnessLoader;
    let ingestConfigurationRuleFormHarness: IngestConfigurationRuleFormHarness;
    let flowRetryPolicyFormHarness: FlowRetryPolicyFormHarness;

    const MOCK_RETRY_POLICY = {
        __typename: "FlowRetryPolicy" as const,
        maxAttempts: 5,
        minDelay: { every: 30, unit: TimeUnit.Minutes },
        backoffType: FlowRetryBackoffType.Exponential,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, ApolloTestingModule, DatasetSettingsIngestConfigurationTabComponent],
            providers: [Apollo, provideToastr()],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsIngestConfigurationTabComponent);
        datasetFlowConfigService = TestBed.inject(DatasetFlowConfigService);

        component = fixture.componentInstance;
        component.ingestConfigurationTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: {
                __typename: "FlowConfigRuleIngest",
                fetchUncacheable: false,
                fetchNextIteration: false,
            },
            retryPolicy: null,
        };

        fixture.detectChanges();
        await fixture.whenStable();

        loader = TestbedHarnessEnvironment.loader(fixture);
        ingestConfigurationRuleFormHarness = await loader.getHarness(IngestConfigurationRuleFormHarness);
        flowRetryPolicyFormHarness = await loader.getHarness(FlowRetryPolicyFormHarness);
    });

    function getSaveButton(): HTMLButtonElement {
        return getElementByDataTestId(fixture, "save-ingest-configuration-btn") as HTMLButtonElement;
    }

    // Helper function to validate form state consistency
    async function expectFormValueToEqual(expectedValue: {
        ingestConfig: { fetchUncacheable: boolean; fetchNextIteration: boolean };
        flowRetryPolicy: {
            retriesEnabled: boolean;
            maxAttempts: number;
            minDelay: { every: number; unit: TimeUnit };
            backoffType: FlowRetryBackoffType;
        };
    }): Promise<void> {
        const domIngestConfigValue = await ingestConfigurationRuleFormHarness.currentFormValue();
        const domFlowRetryPolicyValue = await flowRetryPolicyFormHarness.currentFormValue();

        expect(domIngestConfigValue).toEqual(expectedValue.ingestConfig);
        expect(domFlowRetryPolicyValue).toEqual(expectedValue.flowRetryPolicy);
        expect(component.form.getRawValue()).toEqual({
            ingestConfig: expectedValue.ingestConfig,
            flowRetryPolicy: expectedValue.flowRetryPolicy,
        });
    }

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(ingestConfigurationRuleFormHarness).toBeTruthy();
        expect(flowRetryPolicyFormHarness).toBeTruthy();
    });

    it("should have default form values", async () => {
        expect(component.form.status).toBe("VALID");

        await expectFormValueToEqual({
            ingestConfig: { fetchUncacheable: false, fetchNextIteration: false },
            flowRetryPolicy: {
                retriesEnabled: false,
                maxAttempts: FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS,
                minDelay: FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY,
                backoffType: FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE,
            },
        });
    });

    it("should check 'Save' button is enabled by default", () => {
        expect(component.form.status).toBe("VALID");

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();
    });

    it("should check form is valid when loaded with ingestion rule enabled", async () => {
        component.ingestConfigurationTabData.ingestionRule.fetchUncacheable = true;
        component.ingestConfigurationTabData.ingestionRule.fetchNextIteration = true;
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        await expectFormValueToEqual({
            ingestConfig: { fetchUncacheable: true, fetchNextIteration: true },
            flowRetryPolicy: {
                retriesEnabled: false,
                maxAttempts: FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS,
                minDelay: FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY,
                backoffType: FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE,
            },
        });
    });

    it("should check form is valid when loaded with retry policy", async () => {
        component.ingestConfigurationTabData.retryPolicy = MOCK_RETRY_POLICY;
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        await expectFormValueToEqual({
            ingestConfig: { fetchUncacheable: false, fetchNextIteration: false },
            flowRetryPolicy: {
                retriesEnabled: true,
                maxAttempts: 5,
                minDelay: { every: 30, unit: TimeUnit.Minutes },
                backoffType: FlowRetryBackoffType.Exponential,
            },
        });
    });

    it("should check form is valid when loaded with both ingestion rule and retry policy", async () => {
        component.ingestConfigurationTabData.ingestionRule.fetchUncacheable = true;
        component.ingestConfigurationTabData.ingestionRule.fetchNextIteration = true;
        component.ingestConfigurationTabData.retryPolicy = MOCK_RETRY_POLICY;
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.form.status).toBe("VALID");

        await expectFormValueToEqual({
            ingestConfig: { fetchUncacheable: true, fetchNextIteration: true },
            flowRetryPolicy: {
                retriesEnabled: true,
                maxAttempts: 5,
                minDelay: { every: 30, unit: TimeUnit.Minutes },
                backoffType: FlowRetryBackoffType.Exponential,
            },
        });
    });

    it("should check 'Save' button works for ROOT dataset with ingest configuration", async () => {
        const setDatasetIngestFlowConfigsSpy = spyOn(
            datasetFlowConfigService,
            "setDatasetIngestFlowConfigs",
        ).and.callThrough();

        await ingestConfigurationRuleFormHarness.enableFetchUncacheable();
        await ingestConfigurationRuleFormHarness.enableFetchNextIteration();
        await flowRetryPolicyFormHarness.enableRetries();
        await flowRetryPolicyFormHarness.setMaxAttempts(7);
        await flowRetryPolicyFormHarness.setMinDelay({ every: 45, unit: TimeUnit.Minutes });
        await flowRetryPolicyFormHarness.setBackoffType(FlowRetryBackoffType.Linear);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetIngestFlowConfigsSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                datasetId: mockDatasetBasicsRootFragment.id,
                ingestConfigInput: { fetchUncacheable: true, fetchNextIteration: true },
                retryPolicyInput: {
                    maxAttempts: 7,
                    minDelay: { every: 45, unit: TimeUnit.Minutes },
                    backoffType: FlowRetryBackoffType.Linear,
                },
            }),
        );
    });

    it("should check 'Save' button works with only ingest configuration enabled", async () => {
        const setDatasetIngestFlowConfigsSpy = spyOn(
            datasetFlowConfigService,
            "setDatasetIngestFlowConfigs",
        ).and.callThrough();

        await ingestConfigurationRuleFormHarness.enableFetchUncacheable();
        await ingestConfigurationRuleFormHarness.enableFetchNextIteration();
        // Keep retry policy disabled

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetIngestFlowConfigsSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                datasetId: mockDatasetBasicsRootFragment.id,
                ingestConfigInput: { fetchUncacheable: true, fetchNextIteration: true },
                retryPolicyInput: null,
            }),
        );
    });

    it("should check 'Save' button works with only retry policy enabled", async () => {
        const setDatasetIngestFlowConfigsSpy = spyOn(
            datasetFlowConfigService,
            "setDatasetIngestFlowConfigs",
        ).and.callThrough();

        // Keep ingest configuration disabled
        await flowRetryPolicyFormHarness.enableRetries();
        await flowRetryPolicyFormHarness.setMaxAttempts(2);
        await flowRetryPolicyFormHarness.setMinDelay({ every: 20, unit: TimeUnit.Minutes });
        await flowRetryPolicyFormHarness.setBackoffType(FlowRetryBackoffType.Fixed);

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeFalse();

        saveButton.click();

        expect(setDatasetIngestFlowConfigsSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                datasetId: mockDatasetBasicsRootFragment.id,
                ingestConfigInput: { fetchUncacheable: false, fetchNextIteration: false },
                retryPolicyInput: {
                    maxAttempts: 2,
                    minDelay: { every: 20, unit: TimeUnit.Minutes },
                    backoffType: FlowRetryBackoffType.Fixed,
                },
            }),
        );
    });

    it("should check 'Save' button is disabled when retry policy has invalid values", async () => {
        const setDatasetIngestFlowConfigsSpy = spyOn(
            datasetFlowConfigService,
            "setDatasetIngestFlowConfigs",
        ).and.stub();

        await flowRetryPolicyFormHarness.enableRetries();
        await flowRetryPolicyFormHarness.setMaxAttempts(5);
        await flowRetryPolicyFormHarness.setMinDelay({ every: 65, unit: TimeUnit.Minutes }); // Invalid: exceeds max
        await flowRetryPolicyFormHarness.setBackoffType(FlowRetryBackoffType.Exponential);

        // Wait for validation to kick in
        fixture.detectChanges();
        await fixture.whenStable();

        const saveButton = getSaveButton();
        expect(saveButton.disabled).toBeTrue();

        saveButton.click(); // will be ignored
        expect(setDatasetIngestFlowConfigsSpy).not.toHaveBeenCalled();
    });

    it("should update form values via harnesses and maintain consistency", async () => {
        // Enable ingest configuration
        await ingestConfigurationRuleFormHarness.enableFetchUncacheable();

        // Enable and configure retry policy
        await flowRetryPolicyFormHarness.enableRetries();
        await flowRetryPolicyFormHarness.setMaxAttempts(8);
        await flowRetryPolicyFormHarness.setMinDelay({ every: 12, unit: TimeUnit.Hours }); // Valid: within 0-24 range
        await flowRetryPolicyFormHarness.setBackoffType(FlowRetryBackoffType.ExponentialWithJitter);

        // Verify form consistency
        await expectFormValueToEqual({
            ingestConfig: { fetchUncacheable: true, fetchNextIteration: false },
            flowRetryPolicy: {
                retriesEnabled: true,
                maxAttempts: 8,
                minDelay: { every: 12, unit: TimeUnit.Hours },
                backoffType: FlowRetryBackoffType.ExponentialWithJitter,
            },
        });

        // Verify validation errors are null
        const minDelayValidationError = await flowRetryPolicyFormHarness.getMinDelayValidationError();
        expect(minDelayValidationError).toBeNull();
    });
});
