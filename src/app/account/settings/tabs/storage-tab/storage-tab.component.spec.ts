/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeUndefined } from "@interface/app.types";

import { StorageTabComponent } from "src/app/account/settings/tabs/storage-tab/storage-tab.component";
import { StorageTabHarness } from "src/app/account/settings/tabs/storage-tab/storage-tab.harness";
import {
    mockStorageQuotaNearLimit,
    mockStorageQuotaReached,
    mockStorageQuotaUnlimited,
    mockStorageQuotaWithinLimit,
} from "src/app/account/settings/tabs/storage-tab/storage-tab.mock";
import { AccountStorageQuota } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";
import { AppConfigService } from "src/app/app-config.service";

describe("StorageTabComponent", () => {
    let fixture: ComponentFixture<StorageTabComponent>;
    let supportEmailSpy: jasmine.Spy<() => MaybeUndefined<string>>;

    const TEST_SUPPORT_EMAIL = "support@example.com";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StorageTabComponent],
        }).compileComponents();

        supportEmailSpy = spyOnProperty(TestBed.inject(AppConfigService), "supportEmail", "get").and.returnValue(
            TEST_SUPPORT_EMAIL,
        );
    });

    async function render(quota: AccountStorageQuota): Promise<StorageTabHarness> {
        fixture = TestBed.createComponent(StorageTabComponent);
        fixture.componentRef.setInput(RoutingResolvers.ACCOUNT_SETTINGS_STORAGE_KEY, quota);
        return TestbedHarnessEnvironment.harnessForFixture(fixture, StorageTabHarness);
    }

    it("should create", async () => {
        await render(mockStorageQuotaWithinLimit);
        expect(fixture.componentInstance).toBeTruthy();
    });

    it("should show usage against the limit", async () => {
        const storageTab = await render(mockStorageQuotaWithinLimit);

        expect(await storageTab.getSummary()).toEqual("Used 610.4 MB of 953.7 MB (64%) · 343.3 MB left (36%)");
        expect(await storageTab.getExplanation()).toContain("Once the quota is reached");
        expect(await storageTab.getSegmentWidthPercent("data")).toEqual(50);
        expect(await storageTab.getSegmentWidthPercent("checkpoints")).toEqual(4);
        expect(await storageTab.getSegmentWidthPercent("linked-objects")).toEqual(10);
        expect(await storageTab.isUnlimited()).toBeFalse();
        expect(await storageTab.hasNearQuotaWarning()).toBeFalse();
        expect(await storageTab.isQuotaExhausted()).toBeFalse();
    });

    it("should warn when the quota is almost used", async () => {
        const storageTab = await render(mockStorageQuotaNearLimit);

        expect(await storageTab.hasNearQuotaWarning()).toBeTrue();
        expect(await storageTab.isQuotaExhausted()).toBeFalse();
        expect(await storageTab.getSupportLink()).toEqual(`mailto:${TEST_SUPPORT_EMAIL}`);
    });

    it("should fill the bar and point to support when the quota is exhausted", async () => {
        const storageTab = await render(mockStorageQuotaReached);

        expect(await storageTab.isQuotaExhausted()).toBeTrue();
        expect(await storageTab.hasNearQuotaWarning()).toBeFalse();
        expect(await storageTab.getSegmentWidthPercent("data")).toEqual(100);
        expect(await storageTab.getRemaining()).toEqual("no space left");
        expect(await storageTab.getSupportLink()).toEqual(`mailto:${TEST_SUPPORT_EMAIL}`);
    });

    it("should refer to the administrator when no support email is configured", async () => {
        supportEmailSpy.and.returnValue(undefined);
        const storageTab = await render(mockStorageQuotaReached);

        expect(await storageTab.getSupportLink()).toBeNull();
        expect(await storageTab.getQuotaExhaustedMessage()).toContain("contact your administrator");
    });

    it("should show an unlimited quota without a percentage or warnings", async () => {
        const storageTab = await render(mockStorageQuotaUnlimited);

        expect(await storageTab.isUnlimited()).toBeTrue();
        expect(await storageTab.getSummary()).toEqual("1.9 GB used · Unlimited");
        expect(await storageTab.getExplanation()).toContain("no storage limit");
        expect(await storageTab.getRemaining()).toBeNull();
        expect(await storageTab.hasNearQuotaWarning()).toBeFalse();
        expect(await storageTab.isQuotaExhausted()).toBeFalse();
        expect(await storageTab.getSegmentWidthPercent("data")).toEqual(75);
        expect(await storageTab.getSegmentWidthPercent("checkpoints")).toEqual(25);
        expect(await storageTab.getSegmentWidthPercent("linked-objects")).toEqual(0);
    });
});
