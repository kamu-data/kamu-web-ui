import { Injectable } from "@angular/core";
import { Apollo, ApolloBase } from "apollo-angular";
import { map } from "rxjs/operators";
import { ApolloQueryResult, DocumentNode, gql } from "@apollo/client/core";
import { Observable, of, throwError } from "rxjs";
import {
    Account,
    DatasetIDsInterface,
    PageInfoInterface,
    SearchDatasetByID, SearchMetadataInterface,
    SearchMetadataNodeResponseInterface,
    SearchOverviewDatasetsInterface,
    SearchOverviewInterface,
    TypeNames,
} from "../interface/search.interface";
import {
    DatasetKind,
    SearchAutocompleteGQL,
    SearchAutocompleteQuery,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";
import { ApolloQuerySearchResultNodeInterface } from "./apolloQueryResult.interface";

@Injectable()
export class SearchApi {
    /* eslint-disable  @typescript-eslint/no-explicit-any */

    constructor(
        private apollo: Apollo,
        private searchAutocompleteGQL: SearchAutocompleteGQL,
    ) {}
    private static searchOverviewData(data: {
                                          id: string,
                                          name: string,
                                          owner: Account,
                                          dataset: SearchOverviewDatasetsInterface[],
                                          pageInfo: PageInfoInterface,
                                          totalCount: number,
                                          currentPage: number
                                      }
    ): SearchOverviewInterface {
        return {
            id: data.id,
            name: data.name,
            owner: data.owner,
            dataset: data.dataset,
            pageInfo: data.pageInfo,
            totalCount: data.totalCount,
            currentPage: data.currentPage + 1,
        };
    }
    private static searchMetadataData(data: {
        id: string,
        name: string,
        owner: Account,
        dataset: SearchOverviewDatasetsInterface[],
        pageInfo: PageInfoInterface,
        totalCount: number,
        currentPage: number
    }): SearchMetadataInterface {
        return {
            id: data.id,
            name: data.name,
            owner: data.owner,
            dataset: data.dataset,
            pageInfo: data.pageInfo,
            totalCount: data.totalCount,
            currentPage: data.currentPage + 1,
        };
    }
    private static pageInfoInit(): PageInfoInterface {
        return {
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 0,
        };
    }

    // tslint:disable-next-line: no-any
    public searchIndex(): Observable<any> {
        const GET_DATA = gql``;

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        // @ts-ignore
        return this.apollo.watchQuery({ query: GET_DATA }).valueChanges.pipe(
            map((result: any) => {
                if (result.data) {
                    return result.data.search.query.edges.map((edge: any) => {
                        const d = Object();
                        d.id = edge.node.id;
                        return d;
                    });
                }
            }),
        );
    }
    public searchOverview(
        searchQuery: string,
        page = 0,
    ): Observable<SearchOverviewInterface> {
        const GET_DATA: DocumentNode = gql`
  {
  search {
    query(query: "${searchQuery}", perPage: 2, page: ${page.toString()}) {
     edges {
        node {
          __typename
          ... on Dataset {
            id
            name
            owner {
              id
              name
            }
            kind
            metadata {
                currentDownstreamDependencies {
                  id
                  kind
                }
            
            }
            createdAt
            lastUpdatedAt
            __typename
          }
        }
        __typename
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalPages
      }
      __typename
    }
    __typename
  }
}
`;

        // @ts-ignore
        return this.apollo.watchQuery({ query: GET_DATA }).valueChanges.pipe(
            map((result: any) => {
                let dataset: SearchOverviewDatasetsInterface[] = [];
                let pageInfo: PageInfoInterface = SearchApi.pageInfoInit();
                let totalCount = 0;
                let currentPage = 1;

                if (result.data) {
                    // tslint:disable-next-line: no-any
                    dataset = result.data.search.query.edges.map(
                        (edge: any) => {
                            return this.clearlyData(edge.node);
                        },
                    );
                    pageInfo = result.data.search.query.pageInfo;
                    totalCount = result.data.search.query.totalCount;
                    currentPage = page;
                }

                return SearchApi.searchOverviewData(
                    {
                        id: result.data.datasets.byId.id,
                        name: result.data.datasets.byId.name,
                        owner: result.data.datasets.byId.owner,
                        dataset,
                        pageInfo,
                        totalCount,
                        currentPage,
                    }
                );
            }),
        );
    }
    public autocompleteDatasetSearch(
        id: string,
    ): Observable<DatasetIDsInterface[]> {
        if (id === "") {
            return of([]);
        }

        return this.searchAutocompleteGQL
            .watch({ query: id, perPage: 10 })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<any>) => {
                    const nodesList: DatasetIDsInterface[] =
                        result.data.search.query.nodes.map(
                            (node: ApolloQuerySearchResultNodeInterface) => ({
                                id: node.name,
                                __typename: node.__typename as TypeNames,
                            }),
                        );
                    // Add dummy result that opens search view
                    nodesList.unshift({
                        __typename: TypeNames.allDataType,
                        id,
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

    public searchDataset(params: {
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
                let pageInfo: PageInfoInterface = SearchApi.pageInfoInit();
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

                return SearchApi.searchMetadataData(
                    {
                        id: result.data.datasets.byId.id,
                        name: result.data.datasets.byId.name,
                        owner: result.data.datasets.byId.owner,
                        dataset,
                        pageInfo,
                        totalCount,
                        currentPage
                    }
                );
            }),
        );
    }

    // tslint:disable-next-line: no-any
    clearlyData(edge: any) {
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
