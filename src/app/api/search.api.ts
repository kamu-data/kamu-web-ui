import {Injectable} from "@angular/core";
import {Apollo, ApolloBase} from "apollo-angular";
import {map} from "rxjs/operators";
import {ApolloQueryResult, DocumentNode, gql} from "@apollo/client/core";
import {Observable, of, throwError} from "rxjs";
import {
    DatasetIDsInterface,
    PageInfoInterface,
    SearchMetadataNodeResponseInterface,
    SearchOverviewDatasetsInterface,
    TypeNames,
} from "../interface/search.interface";

import {ApolloQuerySearchResultNodeInterface} from "./apolloQueryResult.interface";
import {
    DatasetMetadataGQL,
    DatasetOverviewGQL, DatasetOverviewQuery,
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
        private datasetOverviewGQL: DatasetOverviewGQL,
        private datasetMetadataGQL: DatasetMetadataGQL,
    ) {
    }

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
            .watch({query: id, perPage: 10})
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


    //////////////////// Datasets Viewer //////////////////////////////

    public getDatasetOverview(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<DatasetOverviewQuery | undefined> {
        return this.datasetOverviewGQL
            .watch({datasetId: params.id, numRecords: params.numRecords || 10})
            .valueChanges.pipe(
                map((result: ApolloQueryResult<DatasetOverviewQuery>) => {
                    if (result.data) {
                        return result.data;
                    }
                    return undefined;
                }),
            );
    }

    // tslint:disable-next-line: no-any
    public onSearchMetadata(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<any> {
        return this.datasetMetadataGQL
            // @ts-ignore
            .watch({datasetId: params.id, $perPage: params.numRecords || 5, $page: params.page || 0})
            .valueChanges.pipe(
                map((result: ApolloQueryResult<DatasetOverviewQuery>) => {
                    if (result.data) {
                        // tslint:disable-next-line: no-any
                        // @ts-ignore
                        return this.apollo.watchQuery({query: GET_DATA}).valueChanges.pipe(
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
                }));
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
        return this.apollo.watchQuery({query: GET_DATA}).valueChanges.pipe(
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
        return this.apollo.watchQuery({query: GET_DATA}).valueChanges.pipe(
            map((result: ApolloQueryResult<any>) => {
                if (result.data) {
                    return result.data.datasets.byId;
                }
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
