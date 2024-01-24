import { InMemoryCache } from "@apollo/client/core";

export function apolloCache(): InMemoryCache {
    return new InMemoryCache({
        typePolicies: {
            Account: {
                // For now we are faking account IDs on the server, so they are a bad caching field
                keyFields: ["accountName"],
            },
            AccountRef: {
                // For now we are faking account IDs on the server, so they are a bad caching field
                keyFields: ["accountName"],
            },
            Query: {
                fields: {
                    datasets: {
                        merge: true,
                    },
                },
            },
            DataQueries: {
                merge: false,
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
        },
    });
}
