/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloCache, InMemoryCache } from "@apollo/client/core";
import { DatasetApi } from "../../api/dataset.api";

export function apolloCache(): InMemoryCache {
    return new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    datasets: {
                        merge: true,
                    },
                },
            },
            Dataset: {
                // Use owner, as ID might be the same between 2 accounts who synchronized
                keyFields: ["owner", "id"],
                fields: {
                    metadata: {
                        merge: true,
                    },
                    data: {
                        merge: true,
                    },
                },
            },
            Datasets: {
                merge: true,
            },
            DatasetMetadata: {
                merge: true,
            },
            Search: {
                merge: true,
            },
            DatasetEnvVars: {
                merge: true,
            },
            Accounts: {
                merge: true,
            },
            MetadataChain: {
                merge: true,
            },
        },
    });
}

export const updateCacheHelper = (
    cache: ApolloCache<unknown>,
    params: { accountId: string; datasetId: string; fieldNames: string[] },
): void => {
    const datasetKeyFragment = DatasetApi.generateDatasetKeyFragment(
        cache.identify(DatasetApi.generateAccountKeyFragment(params.accountId)),
        params.datasetId,
    );
    params.fieldNames.forEach((fieldName: string) => {
        cache.evict({
            id: cache.identify(datasetKeyFragment),
            fieldName,
        });
    });
};

export const resetCacheHelper = (
    cache: ApolloCache<unknown>,
    params: { accountId: string; datasetId: string },
): void => {
    const datasetKeyFragment = DatasetApi.generateDatasetKeyFragment(
        cache.identify(DatasetApi.generateAccountKeyFragment(params.accountId)),
        params.datasetId,
    );
    cache.evict({
        id: cache.identify(datasetKeyFragment),
    });
};
