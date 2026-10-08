/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { requireValue } from "@common/helpers/app.helpers";
import { AccountApi } from "@api/account.api";
import { AccountStorageQuotaQuery } from "@api/kamu.graphql.interface";

import { AccountStorageQuota } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";

@Injectable({
    providedIn: "root",
})
export class AccountStorageQuotaService {
    private accountApi = inject(AccountApi);

    public fetchStorageQuota(accountName: string): Observable<AccountStorageQuota> {
        return this.accountApi.fetchAccountStorageQuota(accountName).pipe(
            map((data: AccountStorageQuotaQuery) => {
                const account = requireValue(data.accounts.byName ?? null, "Account not found");
                const storage = account.usage.storage;
                return {
                    limitBytes: account.quotas.user.storage.limitTotalBytes ?? null,
                    usedBytes: storage.totalSizeBytes,
                    dataBytes: storage.totalDataSizeBytes,
                    checkpointsBytes: storage.totalCheckpointsSizeBytes,
                    linkedObjectsBytes: storage.totalLinkedObjectsSizeBytes,
                };
            }),
        );
    }
}
