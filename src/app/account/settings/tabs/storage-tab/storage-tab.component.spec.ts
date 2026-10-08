/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { checkVisible, getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeUndefined } from "@interface/app.types";

import { StorageTabComponent } from "src/app/account/settings/tabs/storage-tab/storage-tab.component";
import {
    mockStorageQuotaNearLimit,
    mockStorageQuotaReached,
    mockStorageQuotaUnlimited,
    mockStorageQuotaWithinLimit,
} from "src/app/account/settings/tabs/storage-tab/storage-tab.mock";
import { AccountStorageQuota, StorageQuotaState } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";
import { AppConfigService } from "src/app/app-config.service";

describe("StorageTabComponent", () => {
    let component: StorageTabComponent;
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
        createComponent();
    });

    function createComponent(): void {
        fixture = TestBed.createComponent(StorageTabComponent);
        component = fixture.componentInstance;
    }

    function render(quota: AccountStorageQuota): void {
        fixture.componentRef.setInput(RoutingResolvers.ACCOUNT_SETTINGS_STORAGE_KEY, quota);
        fixture.detectChanges();
    }

    function textOf(dataTestId: string): string {
        return (getElementByDataTestId(fixture, dataTestId).textContent ?? "").replace(/\s+/g, " ").trim();
    }

    function segmentWidth(id: string): string {
        return getElementByDataTestId(fixture, `storage-segment-${id}`).style.width;
    }

    it("should create", () => {
        render(mockStorageQuotaWithinLimit);
        expect(component).toBeTruthy();
    });

    it("should show usage against the limit", () => {
        render(mockStorageQuotaWithinLimit);

        expect(component.state).toEqual(StorageQuotaState.WITHIN_QUOTA);
        expect(textOf("storage-summary")).toEqual("Used 610.4 MB of 953.7 MB (64%) · 343.3 MB left (36%)");
        expect(textOf("storage-explanation")).toContain("Once the quota is reached");
        expect(segmentWidth("data")).toEqual("50%");
        expect(segmentWidth("checkpoints")).toEqual("4%");
        expect(segmentWidth("linked-objects")).toEqual("10%");
        checkVisible(fixture, "storage-unlimited", false);
        checkVisible(fixture, "storage-near-quota", false);
        checkVisible(fixture, "storage-quota-reached", false);
    });

    it("should warn when the quota is almost used", () => {
        render(mockStorageQuotaNearLimit);

        expect(component.state).toEqual(StorageQuotaState.NEAR_QUOTA);
        checkVisible(fixture, "storage-near-quota", true);
        checkVisible(fixture, "storage-quota-reached", false);
    });

    it("should fill the bar when the quota is exceeded", () => {
        render(mockStorageQuotaReached);

        expect(component.state).toEqual(StorageQuotaState.QUOTA_REACHED);
        expect(segmentWidth("data")).toEqual("100%");
        expect(textOf("storage-remaining")).toEqual("no space left");
        expect(getElementByDataTestId(fixture, "storage-support-link").getAttribute("href")).toEqual(
            `mailto:${TEST_SUPPORT_EMAIL}`,
        );
        checkVisible(fixture, "storage-quota-reached", true);
        checkVisible(fixture, "storage-near-quota", false);
    });

    it("should refer to the administrator when no support email is configured", () => {
        supportEmailSpy.and.returnValue(undefined);
        createComponent();
        render(mockStorageQuotaReached);

        checkVisible(fixture, "storage-support-link", false);
        expect(textOf("storage-quota-reached")).toContain("contact your administrator");
    });

    it("should show an unlimited quota without a percentage or warnings", () => {
        render(mockStorageQuotaUnlimited);

        expect(component.state).toEqual(StorageQuotaState.UNLIMITED);
        checkVisible(fixture, "storage-unlimited", true);
        expect(textOf("storage-summary")).toEqual("1.9 GB used · Unlimited");
        expect(textOf("storage-explanation")).toContain("no storage limit");
        checkVisible(fixture, "storage-used-percent", false);
        checkVisible(fixture, "storage-remaining", false);
        checkVisible(fixture, "storage-near-quota", false);
        checkVisible(fixture, "storage-quota-reached", false);
        expect(segmentWidth("data")).toEqual("75%");
        expect(segmentWidth("checkpoints")).toEqual("25%");
        expect(segmentWidth("linked-objects")).toEqual("0%");
    });
});
