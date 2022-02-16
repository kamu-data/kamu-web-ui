import { Injectable } from "@angular/core";
import { Apollo, ApolloBase } from "apollo-angular";
import { map } from "rxjs/operators";
import { ApolloQueryResult, DocumentNode, gql } from "@apollo/client/core";
import { Observable, of, throwError } from "rxjs";
import {
    DatasetIDsInterface,
    PageInfoInterface,
    SearchDatasetByID,
    SearchMetadataNodeResponseInterface,
    SearchOverviewDatasetsInterface,
    TypeNames,
} from "../interface/search.interface";

import AppValues from "../common/app.values";
import { ApolloQuerySearchResultNodeInterface } from "./apolloQueryResult.interface";
import {
    SearchDatasetsAutocompleteGQL,
    SearchDatasetsOverviewGQL,
    SearchDatasetsOverviewQuery,
} from "./kamu.graphql.interface";

@Injectable()
export class SearchApi {
    /* eslint-disable  @typescript-eslint/no-explicit-any */

    constructor(
        private apollo: Apollo,
        private searchDatasetsAutocompleteGQL: SearchDatasetsAutocompleteGQL,
        private searchDatasetsOverviewGQL: SearchDatasetsOverviewGQL,
    ) {}
    // private static searchOverviewData(data: {
    //     dataset: SearchOverviewDatasetsInterface[];
    //     pageInfo: PageInfoInterface;
    //     totalCount: number;
    //     currentPage: number;
    // }): SearchOverviewInterface {
    //     return {
    //         dataset: data.dataset,
    //         pageInfo: data.pageInfo,
    //         totalCount: data.totalCount,
    //         currentPage: data.currentPage + 1,
    //     };
    // }
    // private static searchMetadataData(data: {
    //     id: string;
    //     name: string;
    //     owner: Account;
    //     dataset: SearchOverviewDatasetsInterface[];
    //     pageInfo: PageInfoInterface;
    //     totalCount: number;
    //     currentPage: number;
    // }): SearchMetadataInterface {
    //
    // private static searchOverviewData(
    //     dataset: SearchOverviewDatasetsInterface[],
    //     pageInfo: PageInfoInterface,
    //     totalCount: number,
    //     currentPage: number,
    // ): SearchOverviewInterface {
    //     return {
    //         dataset,
    //         pageInfo,
    //         totalCount,
    //         currentPage: currentPage + 1, // TODO: Use zero-based IDs and only offset for display
    //     };
    // }

    public pageInfoInit(): PageInfoInterface {
        return {
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 0,
        };
    }
    // Search query that returs high-level dataset information for displaying the dataaset badge
    public searchOverview(
        searchQuery: string,
        page = 0,
        perPage = 2,
    ): Observable<SearchDatasetsOverviewQuery> {
        // @ts-ignore
        return this.searchDatasetsOverviewGQL
            .watch({
                query: searchQuery,
                perPage,
                page,
            })
            .valueChanges.pipe(
                map(
                    (
                        result: ApolloQueryResult<SearchDatasetsOverviewQuery>,
                    ) => {
                        return result.data;
                    },
                ),
            );
    }
    public autocompleteDatasetSearch(
        id: string,
    ): Observable<DatasetIDsInterface[]> {
        if (id === "") {
            return of([]);
        }

        return this.searchDatasetsAutocompleteGQL
            .watch({ query: id, perPage: 10 })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<any>) => {
                    const nodesList: DatasetIDsInterface[] =
                        result.data.search.query.nodes.map(
                            (node: ApolloQuerySearchResultNodeInterface) => ({
                                name: node.name,
                                id: node.id,
                                __typename: node.__typename as TypeNames,
                            }),
                        );
                    // Add dummy result that opens search view
                    nodesList.unshift({
                        __typename: TypeNames.allDataType,
                        id,
                        name: id
                    });
                    return nodesList;
                }),
            );
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public searchLinageDataset(id: string): Observable<any> {
        if (typeof id !== "string") {
            return throwError("Empty ID");
        }

        const GET_DATA: DocumentNode = gql`
{
  datasets {
    byId(datasetId: "${id}") {
      id
      kind
      metadata {
        currentDownstreamDependencies {
          id
          kind
          metadata {
            currentDownstreamDependencies {
              id
              kind
            }
          }
        }
      }
    }
  }
}
`;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        // @ts-ignore
        return this.apollo.watchQuery({ query: GET_DATA }).valueChanges.pipe(
            map((result: ApolloQueryResult<any>) => {
                if (result.data) {
                    return result.data.datasets.byId;
                }
            }),
        );
    }

    public searchLinageDatasetUpstreamDependencies(
        id: string,
    ): Observable<any> {
        if (typeof id !== "string") {
            return throwError("Empty ID");
        }
        const GET_DATA: DocumentNode = gql`
{
  datasets {
    byId(datasetId: "${id}") {
      id
      kind
      metadata {
        currentUpstreamDependencies {
          id
          kind
          metadata {
            currentUpstreamDependencies {
              id
              kind
            }
          }
        }
      }
    }
  }
}
`;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        // @ts-ignore
        return this.apollo.watchQuery({ query: GET_DATA }).valueChanges.pipe(
            map((result: ApolloQueryResult<any>) => {
                if (result.data) {
                    return result.data.datasets.byId;
                }
            }),
        );
    }

    public getDatasetOverview(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<SearchDatasetByID> {
        const GET_DATA: DocumentNode = gql`
{
  datasets {
  byId(datasetId: "${params.id}") {
    id
    owner {
      id
      name
    }
    name
    kind
    createdAt
    lastUpdatedAt
    metadata {
      currentWatermark
      currentSchema(format: "PARQUET_JSON") {
        format
        content
        __typename
      }
      __typename
    }
    data {
      numRecordsTotal
      estimatedSize
      tail(numRecords: ${params.numRecords || 10}, format: "JSON") {
        format
        content
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

}`;
        // @ts-ignore
        return this.apollo.watchQuery({ query: GET_DATA }).valueChanges.pipe(
            map((result: ApolloQueryResult<any>) => {
                debugger
                if (result.data) {
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    const datasets: any = AppValues.deepCopy(
                        result.data.datasets.byId,
                    );
                    datasets.data.tail.content = JSON.parse(
                        result.data.datasets.byId.data.tail.content,
                    );
                    datasets.metadata.currentSchema.content = JSON.parse(
                        result.data.datasets.byId.metadata.currentSchema
                            .content,
                    );

                    return datasets as SearchDatasetByID;
                }
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                return {} as any;
            }),
        );
    }

    // tslint:disable-next-line: no-any
    public onSearchMetadata(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<any> {
        const GET_DATA: DocumentNode = gql`
{
  datasets {
    byId(datasetId: "${params.id}") {
      id
      owner {
        id
        name
      }
      name
      metadata {
        chain {
          blocks(perPage: ${(params.numRecords || 5).toString()}, page: ${(
            params.page || 0
        ).toString()}) {
            totalCount
            nodes {
              blockHash,
              systemTime
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              totalPages
            }
          }
        }
      }
    }
  }
}`;
        // tslint:disable-next-line: no-any
        // @ts-ignore
        return this.apollo.watchQuery({ query: GET_DATA }).valueChanges.pipe(
            map((result: ApolloQueryResult<any>) => {
                let dataset: SearchOverviewDatasetsInterface[] = [];
                let pageInfo: PageInfoInterface = this.pageInfoInit();
                let totalCount = 0;
                const currentPage = params.page || 0;

                if (result.data) {
                    // tslint:disable-next-line: no-any
                    dataset =
                        result.data.datasets.byId.metadata.chain.blocks.nodes.map(
                            (node: SearchMetadataNodeResponseInterface) => {
                                return this.clearlyData(node);
                            },
                        );
                    pageInfo =
                        result.data.datasets.byId.metadata.chain.blocks
                            .pageInfo;
                    totalCount =
                        result.data.datasets.byId.metadata.chain.blocks
                            .totalCount;
                }

                return {
                    id: result.data.datasets.byId.id,
                    name: result.data.datasets.byId.name,
                    owner: result.data.datasets.byId.owner,
                    dataset,
                    pageInfo,
                    totalCount,
                    currentPage,
                };
            }),
        );
    }

    // tslint:disable-next-line: no-any
    public clearlyData(edge: any) {
        const object = edge;
        const value = "typename";
        const nodeKeys: string[] = Object.keys(object).filter(
            (key) => !key.includes(value),
        );
        const d = Object();

        nodeKeys.forEach((nodeKey: string) => {
            d[nodeKey] = (edge as any)[nodeKey];
        });

        return d;
    }
}
