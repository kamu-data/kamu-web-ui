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
import { MaybeUndefined } from "@interface/app.types";

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
        const fetchSpy = vi
            .spyOn(accountApi, "fetchAccountStorageQuota")
            .mockReturnValue(of(mockAccountStorageQuotaQuery));
        let result: MaybeUndefined<AccountStorageQuota>;
        service.fetchStorageQuota(TEST_ACCOUNT_NAME).subscribe((quota) => (result = quota));

        expect(fetchSpy).toHaveBeenCalledTimes(1);

        expect(fetchSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME);
        expect(result).toEqual({
            limitBytes: 1000000000,
            usedBytes: 640000000,
            dataBytes: 500000000,
            checkpointsBytes: 40000000,
            linkedObjectsBytes: 100000000,
        });
    });

    it("should map a missing limit as unlimited", () => {
        const unlimitedQuery = structuredClone(mockAccountStorageQuotaQuery);
        if (unlimitedQuery.accounts.byName) {
            unlimitedQuery.accounts.byName.quotas.user.storage.limitTotalBytes = null;
        }
        vi.spyOn(accountApi, "fetchAccountStorageQuota").mockReturnValue(of(unlimitedQuery));
        let result: MaybeUndefined<AccountStorageQuota>;
        service.fetchStorageQuota(TEST_ACCOUNT_NAME).subscribe((quota) => (result = quota));

        expect(result?.limitBytes).toBeNull();
    });
});
