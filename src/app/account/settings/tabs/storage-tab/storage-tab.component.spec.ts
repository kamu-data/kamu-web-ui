/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { checkVisible, getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { StorageTabComponent } from "src/app/account/settings/tabs/storage-tab/storage-tab.component";
import {
    mockStorageQuotaNearLimit,
    mockStorageQuotaReached,
    mockStorageQuotaUnlimited,
    mockStorageQuotaWithinLimit,
} from "src/app/account/settings/tabs/storage-tab/storage-tab.mock";
import { AccountStorageQuota, StorageQuotaState } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";

describe("StorageTabComponent", () => {
    let component: StorageTabComponent;
    let fixture: ComponentFixture<StorageTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StorageTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StorageTabComponent);
        component = fixture.componentInstance;
    });

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
        expect(textOf("storage-summary")).toEqual("Used 610.4 MB of 953.7 MB (64%) · 343.3 MB left");
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
        checkVisible(fixture, "storage-quota-reached", true);
        checkVisible(fixture, "storage-near-quota", false);
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
