/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { AccountApi } from "@api/account.api";
import { mockAccountStorageQuotaQuery } from "@api/mock/account.mock";
import { TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountStorageQuotaService } from "src/app/account/settings/tabs/storage-tab/account-storage-quota.service";
import { AccountStorageQuota } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";

describe("AccountStorageQuotaService", () => {
    let service: AccountStorageQuotaService;
    let accountApi: AccountApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        accountApi = TestBed.inject(AccountApi);
        service = TestBed.inject(AccountStorageQuotaService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should map the storage quota and usage", () => {
        const fetchSpy = spyOn(accountApi, "fetchAccountStorageQuota").and.returnValue(
            of(mockAccountStorageQuotaQuery),
        );
        let result: AccountStorageQuota | undefined;
        service.fetchStorageQuota(TEST_ACCOUNT_NAME).subscribe((quota) => (result = quota));

        expect(fetchSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME);
        expect(result).toEqual({
            limitBytes: 1_000_000_000,
            usedBytes: 640_000_000,
            dataBytes: 500_000_000,
            checkpointsBytes: 40_000_000,
            linkedObjectsBytes: 100_000_000,
        });
    });

    it("should map a missing limit as unlimited", () => {
        const unlimitedQuery = structuredClone(mockAccountStorageQuotaQuery);
        if (unlimitedQuery.accounts.byName) {
            unlimitedQuery.accounts.byName.quotas.user.storage.limitTotalBytes = null;
        }
        spyOn(accountApi, "fetchAccountStorageQuota").and.returnValue(of(unlimitedQuery));
        let result: AccountStorageQuota | undefined;
        service.fetchStorageQuota(TEST_ACCOUNT_NAME).subscribe((quota) => (result = quota));

        expect(result?.limitBytes).toBeNull();
    });
});
