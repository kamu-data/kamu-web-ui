/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DecimalPipe, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeUndefined } from "@interface/app.types";

import {
    AccountStorageQuota,
    StorageQuotaState,
    StorageUsageSegment,
} from "src/app/account/settings/tabs/storage-tab/storage-tab.model";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-storage-tab",
    templateUrl: "./storage-tab.component.html",
    styleUrls: ["./storage-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        DecimalPipe,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        //-----//
        MatDividerModule,
        MatIconModule,
        //-----//
        DisplaySizePipe,
    ],
})
export class StorageTabComponent {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_STORAGE_KEY) public set storageQuota(value: AccountStorageQuota) {
        this.quota = value;
        this.state = StorageTabComponent.deduceState(value);
        this.segments = StorageTabComponent.buildSegments(value);
    }

    public static readonly NEAR_QUOTA_PERCENT = 90;
    public readonly StorageQuotaState: typeof StorageQuotaState = StorageQuotaState;
    public readonly supportEmail: MaybeUndefined<string> = inject(AppConfigService).supportEmail;

    public quota: AccountStorageQuota;
    public state: StorageQuotaState;
    public segments: StorageUsageSegment[] = [];

    public get usedPercent(): number {
        return StorageTabComponent.usedPercent(this.quota);
    }

    public get remainingBytes(): number {
        return Math.max((this.quota.limitBytes ?? 0) - this.quota.usedBytes, 0);
    }

    /** Complements the rounded used percentage, so that both always add up to 100% */
    public get remainingPercent(): number {
        return Math.max(100 - Math.round(this.usedPercent), 0);
    }

    public trackBySegmentId(_index: number, segment: StorageUsageSegment): string {
        return segment.id;
    }

    private static usedPercent(quota: AccountStorageQuota): number {
        if (quota.limitBytes === null) {
            return 0;
        }
        if (quota.limitBytes === 0) {
            return quota.usedBytes > 0 ? 100 : 0;
        }
        return (quota.usedBytes / quota.limitBytes) * 100;
    }

    private static deduceState(quota: AccountStorageQuota): StorageQuotaState {
        if (quota.limitBytes === null) {
            return StorageQuotaState.UNLIMITED;
        }
        const percent = StorageTabComponent.usedPercent(quota);
        if (quota.usedBytes >= quota.limitBytes) {
            return StorageQuotaState.QUOTA_REACHED;
        }
        if (percent >= StorageTabComponent.NEAR_QUOTA_PERCENT) {
            return StorageQuotaState.NEAR_QUOTA;
        }
        return StorageQuotaState.WITHIN_QUOTA;
    }

    private static buildSegments(quota: AccountStorageQuota): StorageUsageSegment[] {
        // An unlimited bar shows only the breakdown of the used space,
        // an exceeded quota fills the whole bar
        const scale = quota.limitBytes === null ? quota.usedBytes : Math.max(quota.limitBytes, quota.usedBytes);
        const percentOf = (bytes: number): number => (scale > 0 ? (bytes / scale) * 100 : 0);
        return [
            { id: "data", label: "Data", bytes: quota.dataBytes, percent: percentOf(quota.dataBytes) },
            {
                id: "checkpoints",
                label: "Checkpoints",
                bytes: quota.checkpointsBytes,
                percent: percentOf(quota.checkpointsBytes),
            },
            {
                id: "linked-objects",
                label: "Linked files",
                bytes: quota.linkedObjectsBytes,
                percent: percentOf(quota.linkedObjectsBytes),
            },
        ];
    }
}
