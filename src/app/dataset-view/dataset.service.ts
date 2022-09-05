import { DatasetInfo } from "./../interface/navigation.interface";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {
    DataRow,
    DatasetLineageNode,
    DatasetSchema,
} from "../interface/dataset.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataDetailsFragment,
    DatasetOverviewFragment,
    GetDatasetOverviewQuery,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    GetDatasetLineageQuery,
    GetDatasetMetadataSchemaQuery,
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { ModalService } from "../components/modal/modal.service";
import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";
import {
    DatasetHistoryUpdate,
    DataUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./dataset.subscriptions.interface";
import { isNil } from "lodash";
import _ from "lodash";
import { logError } from "../common/app.helpers";
import { DatasetApi } from "../api/dataset.api";

@Injectable()
export class AppDatasetService {
    constructor(
        private datasetApi: DatasetApi,
        private modalService: ModalService,
        private appDatasetSubsService: AppDatasetSubscriptionsService,
    ) {}

    private datasetChanges$: Subject<DatasetBasicsFragment> =
        new Subject<DatasetBasicsFragment>();

    public get onDatasetChanges(): Observable<DatasetBasicsFragment> {
        return this.datasetChanges$.asObservable();
    }

    public datasetChanges(searchDatasetInfo: DatasetBasicsFragment): void {
        this.datasetChanges$.next(searchDatasetInfo);
    }

    public requestDatasetDataSchema(info: DatasetInfo): void {
        this.datasetApi
            .getDatasetOverview(info)
            .subscribe((data: GetDatasetOverviewQuery) => {
                if (isNil(data.datasets.byOwnerAndName)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    _.cloneDeep<DatasetBasicsFragment>(
                        data.datasets.byOwnerAndName,
                    );
                this.datasetChanges(dataset);

                const content: DataRow[] =
                    AppDatasetService.parseContentOfDataset(data);
                const schema: DatasetSchema = JSON.parse(
                    data.datasets.byOwnerAndName.metadata.currentSchema.content,
                ) as DatasetSchema;
                const dataUpdate: DataUpdate = { content, schema };
                this.appDatasetSubsService.changeDatasetData(dataUpdate);
            });
    }

    public requestDatasetOverview(info: DatasetInfo): void {
        this.datasetApi
            .getDatasetOverview(info)
            .subscribe((data: GetDatasetOverviewQuery) => {
                if (isNil(data.datasets.byOwnerAndName)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    _.cloneDeep<DatasetBasicsFragment>(
                        data.datasets.byOwnerAndName,
                    );
                this.datasetChanges(dataset);

                const content: DataRow[] =
                    AppDatasetService.parseContentOfDataset(data);
                const overview: DatasetOverviewFragment =
                    _.cloneDeep<DatasetOverviewFragment>(
                        data.datasets.byOwnerAndName,
                    );
                const size: DatasetDataSizeFragment =
                    _.cloneDeep<DatasetDataSizeFragment>(
                        data.datasets.byOwnerAndName.data,
                    );
                const overviewDataUpdate: OverviewDataUpdate = {
                    content,
                    overview,
                    size,
                };
                this.appDatasetSubsService.changeDatasetOverviewData(
                    overviewDataUpdate,
                );
            });
    }

    public requestDatasetHistory(
        info: DatasetInfo,
        numRecords: number,
        numPage: number,
    ): void {
        this.datasetApi
            .getDatasetHistory({ ...info, numRecords, numPage })
            .subscribe((data: GetDatasetHistoryQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const dataset: DatasetBasicsFragment =
                        _.cloneDeep<DatasetBasicsFragment>(
                            data.datasets.byOwnerAndName,
                        );
                    this.datasetChanges(dataset);
                    const pageInfo: PageBasedInfo = Object.assign(
                        _.cloneDeep(
                            data.datasets.byOwnerAndName.metadata.chain.blocks
                                .pageInfo,
                        ),
                        { currentPage: numPage },
                    );
                    const historyUpdate: DatasetHistoryUpdate = {
                        history: data.datasets.byOwnerAndName.metadata.chain
                            .blocks.nodes as MetadataBlockFragment[],
                        pageInfo,
                    };
                    this.appDatasetSubsService.changeDatasetHistory(
                        historyUpdate,
                    );
                }
            });
    }

    public requestDatasetMetadata(info: DatasetInfo, page: number): void {
        this.datasetApi
            .getDatasetMetadata({ ...info, page })
            .subscribe((data: GetDatasetMetadataSchemaQuery) => {
                if (isNil(data.datasets.byOwnerAndName)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    _.cloneDeep<DatasetBasicsFragment>(
                        data.datasets.byOwnerAndName,
                    );
                const schema: DatasetSchema = JSON.parse(
                    data.datasets.byOwnerAndName.metadata.currentSchema.content,
                ) as DatasetSchema;
                const metadata: DatasetMetadataDetailsFragment = _.cloneDeep(
                    data.datasets.byOwnerAndName.metadata,
                );
                const pageInfo: PageBasedInfo = {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalPages: 1,
                    currentPage: page,
                };
                const metadataSchemaUpdate: MetadataSchemaUpdate = {
                    schema,
                    pageInfo,
                    metadata,
                };
                this.appDatasetSubsService.metadataSchemaChanges(
                    metadataSchemaUpdate,
                );
                this.datasetChanges(dataset);
            });
    }

    public requestDatasetDataSqlRun(query: string, limit: number): void {
        this.datasetApi.getDatasetDataSqlRun({ query, limit }).subscribe(
            (data: GetDatasetDataSqlRunQuery) => {
                const content: DataRow[] = JSON.parse(
                    data.data.query.data.content,
                ) as DataRow[];
                const schema: DatasetSchema = JSON.parse(
                    data.data.query.schema.content,
                ) as DatasetSchema;
                const dataUpdate: DataUpdate = { content, schema };
                this.appDatasetSubsService.changeDatasetData(dataUpdate);
            },
            (error: { message: string }) => {
                this.modalService
                    .error({
                        title: "Request was malformed.",
                        message: error.message,
                        yesButtonText: "Close",
                    })
                    .catch((e) => logError(e));
            },
        );
    }

    public requestDatasetLineage(info: DatasetInfo): void {
        this.datasetApi
            .getDatasetLineage(info)
            .subscribe((data: GetDatasetLineageQuery) => {
                if (isNil(data.datasets.byOwnerAndName)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    _.cloneDeep<DatasetBasicsFragment>(
                        data.datasets.byOwnerAndName,
                    );
                this.datasetChanges(dataset);

                const lineageResponse: DatasetLineageNode =
                    this.lineageResponseFromRawQuery(data);
                this.updatelineageGraph(lineageResponse);
            });
    }

    private lineageResponseFromRawQuery(
        data: GetDatasetLineageQuery,
    ): DatasetLineageNode {
        if (isNil(data.datasets.byOwnerAndName)) {
            throw new Error("Dataset not resolved by ID");
        }
        const originDatasetBasics = data.datasets
            .byOwnerAndName as DatasetBasicsFragment;
        const originMetadata = data.datasets.byOwnerAndName.metadata;

        return {
            basics: originDatasetBasics,
            downstreamDependencies:
                originMetadata.currentDownstreamDependencies.map(
                    (downDependency) => {
                        return {
                            basics: downDependency as DatasetBasicsFragment,
                            downstreamDependencies:
                                downDependency.metadata.currentDownstreamDependencies.map(
                                    (downDependency2) => {
                                        return {
                                            basics: downDependency2 as DatasetBasicsFragment,
                                            downstreamDependencies:
                                                downDependency2.metadata.currentDownstreamDependencies.map(
                                                    (downDependency3) => {
                                                        return {
                                                            basics: downDependency3 as DatasetBasicsFragment,
                                                            downstreamDependencies:
                                                                downDependency3.metadata.currentDownstreamDependencies.map(
                                                                    (
                                                                        downDependency4,
                                                                    ) => {
                                                                        return {
                                                                            basics: downDependency4 as DatasetBasicsFragment,
                                                                            downstreamDependencies:
                                                                                downDependency4.metadata.currentDownstreamDependencies.map(
                                                                                    (
                                                                                        downDependency5,
                                                                                    ) => {
                                                                                        return {
                                                                                            basics: downDependency5 as DatasetBasicsFragment,
                                                                                            downstreamDependencies:
                                                                                                [],
                                                                                            upstreamDependencies:
                                                                                                [],
                                                                                        };
                                                                                    },
                                                                                ),
                                                                            upstreamDependencies:
                                                                                [],
                                                                        };
                                                                    },
                                                                ),
                                                            upstreamDependencies:
                                                                [],
                                                        };
                                                    },
                                                ),
                                            upstreamDependencies: [],
                                        };
                                    },
                                ),
                            upstreamDependencies: [],
                        };
                    },
                ),
            upstreamDependencies:
                originMetadata.currentUpstreamDependencies.map(
                    (upDependency) => {
                        return {
                            basics: upDependency as DatasetBasicsFragment,
                            downstreamDependencies: [],
                            upstreamDependencies:
                                upDependency.metadata.currentUpstreamDependencies.map(
                                    (upDependency2) => {
                                        return {
                                            basics: upDependency2 as DatasetBasicsFragment,
                                            downstreamDependencies: [],
                                            upstreamDependencies:
                                                upDependency2.metadata.currentUpstreamDependencies.map(
                                                    (upDependency3) => {
                                                        return {
                                                            basics: upDependency3 as DatasetBasicsFragment,
                                                            downstreamDependencies:
                                                                [],
                                                            upstreamDependencies:
                                                                upDependency3.metadata.currentUpstreamDependencies.map(
                                                                    (
                                                                        upDependency4,
                                                                    ) => {
                                                                        return {
                                                                            basics: upDependency4 as DatasetBasicsFragment,
                                                                            downstreamDependencies:
                                                                                [],
                                                                            upstreamDependencies:
                                                                                upDependency4.metadata.currentUpstreamDependencies.map(
                                                                                    (
                                                                                        upDependency5,
                                                                                    ) => {
                                                                                        return {
                                                                                            basics: upDependency5 as DatasetBasicsFragment,
                                                                                            downstreamDependencies:
                                                                                                [],
                                                                                            upstreamDependencies:
                                                                                                [],
                                                                                        };
                                                                                    },
                                                                                ),
                                                                        };
                                                                    },
                                                                ),
                                                        };
                                                    },
                                                ),
                                        };
                                    },
                                ),
                        };
                    },
                ),
        };
    }

    private updatelineageGraph(origin: DatasetLineageNode) {
        const lineageGraphEdges: DatasetBasicsFragment[][] = [];
        const lineageGraphNodes: DatasetBasicsFragment[] = [];

        this.updateLineageGraphRecords(
            origin,
            lineageGraphNodes,
            lineageGraphEdges,
        );
        this.appDatasetSubsService.changeLineageData({
            origin: origin.basics,
            nodes: lineageGraphNodes,
            edges: lineageGraphEdges,
        });
    }

    private updateLineageGraphRecords(
        currentNode: DatasetLineageNode,
        lineageGraphNodes: DatasetBasicsFragment[],
        lineageGraphEdges: DatasetBasicsFragment[][],
    ) {
        if (
            !lineageGraphNodes.some(
                (existingNode: DatasetBasicsFragment) =>
                    existingNode.id === currentNode.basics.id,
            )
        ) {
            lineageGraphNodes.push(currentNode.basics);
        }

        currentNode.downstreamDependencies.forEach(
            (dependency: DatasetLineageNode) => {
                lineageGraphEdges.push([currentNode.basics, dependency.basics]);
                this.updateLineageGraphRecords(
                    dependency,
                    lineageGraphNodes,
                    lineageGraphEdges,
                );
            },
        );

        currentNode.upstreamDependencies.forEach(
            (dependency: DatasetLineageNode) => {
                lineageGraphEdges.push([dependency.basics, currentNode.basics]);
                this.updateLineageGraphRecords(
                    dependency,
                    lineageGraphNodes,
                    lineageGraphEdges,
                );
            },
        );
    }

    private static parseContentOfDataset(
        data: GetDatasetOverviewQuery,
    ): DataRow[] {
        return data.datasets.byOwnerAndName
            ? (JSON.parse(
                  data.datasets.byOwnerAndName.data.tail.data.content,
              ) as DataRow[])
            : [];
    }
}
