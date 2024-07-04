import { InMemoryCache } from "@apollo/client/core";

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
        },
    });
}
