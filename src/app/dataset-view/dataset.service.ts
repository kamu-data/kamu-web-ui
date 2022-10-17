import { InvalidSqlError } from "./../common/errors";
import { DatasetPageInfoFragment } from "./../api/kamu.graphql.interface";
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
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    GetDatasetMainDataQuery,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";
import {
    DatasetHistoryUpdate,
    DataUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./dataset.subscriptions.interface";
import { isNil } from "lodash";
import { DatasetApi } from "../api/dataset.api";
import { DatasetNotFoundError } from "../common/errors";

@Injectable({ providedIn: "root" })
export class AppDatasetService {
    constructor(
        private datasetApi: DatasetApi,
        private appDatasetSubsService: AppDatasetSubscriptionsService
    ) {}

    private datasetChanges$: Subject<DatasetBasicsFragment> =
        new Subject<DatasetBasicsFragment>();

    public get onDatasetChanges(): Observable<DatasetBasicsFragment> {
        return this.datasetChanges$.asObservable();
    }

    public datasetChanges(searchDatasetInfo: DatasetBasicsFragment): void {
        this.datasetChanges$.next(searchDatasetInfo);
    }

    public requestDatasetMainData(info: DatasetInfo): void {
        this.datasetApi.getDatasetMainData(info).subscribe(
            (data: GetDatasetMainDataQuery) => {
                if (data.datasets.byOwnerAndName) {
                    this.datasetUpdate(data.datasets.byOwnerAndName);
                    this.overviewTabDataUpdate(data);
                    this.dataTabDataUpdate(data);
                    this.metadataTabDataUpdate(data);
                    this.lineageTabDataUpdate(data);
                } else {
                    throw new DatasetNotFoundError();
                }
            }
        );
    }

    public requestDatasetHistory(
        info: DatasetInfo,
        numRecords: number,
        numPage: number,
    ): void {
        this.datasetApi
            .getDatasetHistory({ ...info, numRecords, numPage })
            .subscribe(
                (data: GetDatasetHistoryQuery) => {
                    if (data.datasets.byOwnerAndName) {
                        const dataset: DatasetBasicsFragment =
                            data.datasets.byOwnerAndName;
                        this.datasetChanges(dataset);
                        const pageInfo: DatasetPageInfoFragment = Object.assign(
                            {},
                            data.datasets.byOwnerAndName.metadata.chain.blocks
                                .pageInfo,
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
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }
            );
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
            () => {
                throw new InvalidSqlError();
            },
        );
    }

    private datasetUpdate(data: DatasetBasicsFragment): void {
        const dataset: DatasetBasicsFragment = data;
        this.datasetChanges(dataset);
    }

    private overviewTabDataUpdate(data: GetDatasetMainDataQuery): void {
        if (data.datasets.byOwnerAndName) {
            const content: DataRow[] =
                AppDatasetService.parseContentOfDataset(data);
            const overview: DatasetOverviewFragment =
                data.datasets.byOwnerAndName;

            const size: DatasetDataSizeFragment =
                data.datasets.byOwnerAndName.data;

            const overviewDataUpdate: OverviewDataUpdate = {
                content,
                overview,
                size,
            };
            this.appDatasetSubsService.changeDatasetOverviewData(
                overviewDataUpdate,
            );
        }
    }

    private dataTabDataUpdate(data: GetDatasetMainDataQuery): void {
        if (data.datasets.byOwnerAndName) {
            const content: DataRow[] =
                AppDatasetService.parseContentOfDataset(data);
            const schemaData: DatasetSchema = JSON.parse(
                data.datasets.byOwnerAndName.metadata.currentSchema.content,
            ) as DatasetSchema;
            const dataUpdate: DataUpdate = { content, schema: schemaData };
            this.appDatasetSubsService.changeDatasetData(dataUpdate);
        }
    }

    private metadataTabDataUpdate(data: GetDatasetMainDataQuery): void {
        if (data.datasets.byOwnerAndName) {
            const schemaMetadata: DatasetSchema = JSON.parse(
                data.datasets.byOwnerAndName.metadata.currentSchema.content,
            ) as DatasetSchema;
            const metadata: DatasetMetadataSummaryFragment =
                data.datasets.byOwnerAndName;

            const pageInfo: DatasetPageInfoFragment = {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
                currentPage: 1,
            };
            const metadataSchemaUpdate: MetadataSchemaUpdate = {
                schema: schemaMetadata,
                pageInfo,
                metadata,
            };
            this.appDatasetSubsService.metadataSchemaChanges(
                metadataSchemaUpdate,
            );
        }
    }

    private lineageTabDataUpdate(data: GetDatasetMainDataQuery): void {
        const lineageResponse: DatasetLineageNode =
            this.lineageResponseFromRawQuery(data);
        this.updatelineageGraph(lineageResponse);
    }

    private lineageResponseFromRawQuery(
        data: GetDatasetMainDataQuery,
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
        data: GetDatasetMainDataQuery,
    ): DataRow[] {
        return data.datasets.byOwnerAndName
            ? (JSON.parse(
                  data.datasets.byOwnerAndName.data.tail.data.content,
              ) as DataRow[])
            : [];
    }
}
