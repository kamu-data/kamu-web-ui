import { Injectable } from "@angular/core";
import { empty, from, Observable, of, Subject, Subscription } from "rxjs";
import { SearchApi } from "../api/search.api";
import {
    DatasetCurrentUpstreamDependencies,
    DatasetInfoInterface,
    DatasetKindInterface,
    DatasetKindTypeNames,
    DatasetLinageResponse,
    DatasetNameInterface,
    SearchDatasetByID,
    SearchHistoryInterface,
    SearchMetadataInterface,
    SearchOverviewDatasetsInterface,
    SearchOverviewInterface,
} from "../interface/search.interface";
import { expand, flatMap, map } from "rxjs/operators";
import {
    DataSchema,
    DatasetOverviewQuery,
    GetDatasetHistoryQuery,
} from "../api/kamu.graphql.interface";
import AppValues from "../common/app.values";
import { debug } from "util";

@Injectable()
export class AppDatasetService {
    public onSearchLinageDatasetSubscribtion: Subscription;

    constructor(private searchApi: SearchApi) {}

    public get onSearchDatasetInfoChanges(): Observable<DatasetInfoInterface> {
        return this.searchDatasetInfoChanges$.asObservable();
    }

    public get onSearchDatasetNameChanges(): Observable<DatasetNameInterface> {
        return this.searchDatasetNameChanges$.asObservable();
    }

    public get onSearchChanges(): Observable<string> {
        return this.searchChanges$.asObservable();
    }

    public get onSearchDataChanges(): Observable<
        SearchHistoryInterface[] | SearchOverviewDatasetsInterface[]
    > {
        return this.searchDataChanges$.asObservable();
    }

    public get onKindInfoChanges(): Observable<DatasetKindInterface[]> {
        return this.kindInfoChanges$.asObservable();
    }

    public get onSearchMetadataChanges(): Observable<SearchOverviewInterface> {
        return this.searchMetadataChanges$.asObservable();
    }

    public get getSearchData():
        | SearchHistoryInterface[]
        | SearchOverviewDatasetsInterface[] {
        return this.searchData;
    }

    public get onDatasetTreeChanges(): Observable<
        { id: string; kind: DatasetKindTypeNames }[][]
    > {
        return this.datasetTreeChanges$.asObservable();
    }
    public get onDataSchemaChanges(): Observable<DataSchema> {
        return this.datasetSchemaChanges$.asObservable();
    }

    public get getDatasetTree(): {
        id: string;
        kind: DatasetKindTypeNames;
    }[][] {
        return this.datasetTree;
    }

    public get kindInfo(): DatasetKindInterface[] {
        return this.datasetKindInfo;
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public searchData: any[] = [];
    private kindInfoChanges$: Subject<DatasetKindInterface[]> = new Subject<
        DatasetKindInterface[]
    >();
    private searchChanges$: Subject<string> = new Subject<string>();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private searchDataChanges$: Subject<any[]> = new Subject<any[]>();
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private searchDatasetInfoChanges$: Subject<any> = new Subject<any>();
    private searchDatasetNameChanges$: Subject<DatasetNameInterface> =
        new Subject<DatasetNameInterface>();
    private searchMetadataChanges$: Subject<SearchOverviewInterface> =
        new Subject<SearchOverviewInterface>();
    private datasetTreeChanges$: Subject<
        { id: string; kind: DatasetKindTypeNames }[][]
    > = new Subject<{ id: string; kind: DatasetKindTypeNames }[][]>();
    private datasetSchemaChanges$: Subject<DataSchema> =
        new Subject<DataSchema>();
    private datasetTree: { id: string; kind: DatasetKindTypeNames }[][] = [];
    private datasetKindInfo: DatasetKindInterface[] = [];

    private static getDatasetInfo(
        byID: SearchDatasetByID,
    ): DatasetInfoInterface {
        return {
            id: byID.id,
            kind: byID.kind,
            name: byID.name,
            owner: byID.owner,
            __typename: byID.__typename,
            createdAt: byID.createdAt,
            lastUpdatedAt: byID.lastUpdatedAt,
            estimatedSize: byID.data.estimatedSize,
            numRecordsTotal: byID.data.numRecordsTotal,
            metadata: byID.metadata,
        };
    }

    public searchDatasetInfoChanges(
        searchDatasetInfo: DatasetInfoInterface,
    ): void {
        this.searchDatasetInfoChanges$.next(searchDatasetInfo);
    }

    public searchDatasetNameChanges(
        searchDatasetName: DatasetNameInterface,
    ): void {
        this.searchDatasetNameChanges$.next(searchDatasetName);
    }
    public datasetSchemaChanges(schema: DataSchema): void {
        this.datasetSchemaChanges$.next(schema);
    }

    public searchDataChanges(
        searchData:
            | SearchHistoryInterface[]
            | SearchOverviewDatasetsInterface[],
    ): void {
        this.searchDataChanges$.next(searchData);
    }

    public kindInfoChanges(datasetList: DatasetKindInterface[]): void {
        this.kindInfoChanges$.next(datasetList);
    }

    public searchMetadataChange(data: SearchOverviewInterface) {
        return this.searchMetadataChanges$.next(data);
    }

    public datasetTreeChange(
        datasetTree: { id: string; kind: DatasetKindTypeNames }[][],
    ): void {
        this.datasetTreeChanges$.next(datasetTree);
    }

    public resetKindInfo(): void {
        this.datasetKindInfo = [];
        this.kindInfoChanges([]);
    }

    public setKindInfo(dataset: DatasetKindInterface): void {
        if (
            this.datasetKindInfo.some(
                (realDataset: DatasetKindInterface) =>
                    realDataset.id === dataset.id,
            )
        ) {
            return;
        }
        this.datasetKindInfo.push({ id: dataset.id, kind: dataset.kind });
        this.kindInfoChanges(this.datasetKindInfo);
    }

    public resetDatasetTree(): void {
        this.datasetTree = [];
    }

    public getDatasetDataSchema(
        id: string,
        numRecords: number,
        page: number,
    ): void {
        this.searchApi
            .getDatasetOverview({ id, page })
            .subscribe((data: DatasetOverviewQuery | undefined) => {
                let datasets: SearchDatasetByID;
                if (data) {
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    datasets = AppValues.deepCopy(data.datasets.byId);
                    datasets.data.tail.content = data.datasets.byId
                        ? JSON.parse(data.datasets?.byId?.data.tail.content)
                        : ({} as any);
                    datasets.metadata.currentSchema.content = data.datasets.byId
                        ? JSON.parse(
                              data.datasets.byId.metadata.currentSchema.content,
                          )
                        : ({} as any);

                    this.searchDatasetNameChanges({
                        id: datasets.id,
                        name: datasets.name,
                        owner: datasets.owner,
                    });
                    const datasetInfo =
                        AppDatasetService.getDatasetInfo(datasets);
                    this.searchDatasetInfoChanges(datasetInfo);
                    this.searchData = datasets.data.tail.content;
                    this.searchDataChanges(datasets.data.tail.content);
                    this.datasetSchemaChanges(
                        data.datasets.byId?.metadata
                            ?.currentSchema as DataSchema,
                    );
                }
            });
    }

    public getDatasetOverview(id: string, page: number): void {
        this.searchApi
            .getDatasetOverview({ id, page })
            .subscribe((data: DatasetOverviewQuery | undefined) => {
                let datasets: SearchDatasetByID;
                if (data) {
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    datasets = AppValues.deepCopy(data.datasets.byId);
                    datasets.data.tail.content = data.datasets.byId
                        ? JSON.parse(data.datasets?.byId?.data.tail.content)
                        : ({} as any);
                    datasets.metadata.currentSchema.content = data.datasets.byId
                        ? JSON.parse(
                              data.datasets.byId.metadata.currentSchema.content,
                          )
                        : ({} as any);

                    this.searchDatasetNameChanges({
                        id: datasets.id,
                        name: datasets.name,
                        owner: datasets.owner,
                    });
                    const datasetInfo =
                        AppDatasetService.getDatasetInfo(datasets);
                    this.searchDatasetInfoChanges(datasetInfo);
                    this.searchData = datasets.data.tail.content;
                    this.searchDataChanges(datasets.data.tail.content);
                }
            });
    }

    public onDatasetHistorySchema(
        id: string,
        numRecords: number,
        numPage: number,
    ): void {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        this.searchApi
            .onDatasetHistory({ id, numRecords, numPage })
            .subscribe((data: GetDatasetHistoryQuery) => {
                if (data) {
                    debugger;
                    this.searchDatasetNameChanges({
                        id: data.datasets.byId?.id,
                        name: data.datasets.byId?.name,
                        owner: data.datasets.byId?.owner as any,
                    });
                    // this.searchData = data.datasets.byId?.metadata;
                }
            });
    }

    public onSearchMetadata(id: string, page: number): void {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        this.searchApi
            .onSearchMetadata({ id, page })
            .subscribe((data: SearchMetadataInterface | undefined) => {
                if (data) {
                    this.searchDatasetNameChanges({
                        id: data.id,
                        name: data.name,
                        owner: data.owner,
                    });
                    this.searchData = data.dataset;
                    this.searchMetadataChange(data);
                }
            });
    }

    public onSearchLinageDataset(id: string): void {
        this.resetDatasetTree();
        this.resetKindInfo();
        this.onSearchLinageDatasetSubscribtion = this.searchApi
            .searchLinageDatasetUpstreamDependencies(id)
            .pipe(
                map((result: DatasetLinageResponse) => {
                    return result;
                }),
                // @ts-ignore
                expand((result: DatasetLinageResponse) => {
                    if (
                        (result.kind === DatasetKindTypeNames.root &&
                            !result.metadata.currentUpstreamDependencies
                                ?.length) ||
                        (result.kind === DatasetKindTypeNames.derivative &&
                            !result.metadata.currentUpstreamDependencies
                                ?.length)
                    ) {
                        return this.searchApi
                            .searchLinageDataset(result.id)
                            .pipe(
                                flatMap((result2: DatasetLinageResponse) => {
                                    this.changeDatasetTree(result2);
                                    return from(
                                        // @ts-ignore
                                        result2.metadata
                                            .currentDownstreamDependencies,
                                    ).pipe(
                                        flatMap((d: DatasetLinageResponse) => {
                                            // @ts-ignore
                                            if (
                                                !d.metadata
                                                    .currentDownstreamDependencies
                                                    ?.length ||
                                                (d.metadata
                                                    .currentDownstreamDependencies
                                                    ?.length &&
                                                    // @ts-ignore
                                                    d.metadata.currentDownstreamDependencies.some(
                                                        (
                                                            upDep: DatasetLinageResponse,
                                                        ) =>
                                                            upDep.kind ===
                                                            DatasetKindTypeNames.root,
                                                    )) ||
                                                // @ts-ignore
                                                (d.currentDownstreamDependencies
                                                    ?.length &&
                                                    // @ts-ignore
                                                    d.currentDownstreamDependencies.some(
                                                        (
                                                            upDep: DatasetLinageResponse,
                                                        ) =>
                                                            upDep.kind ===
                                                            DatasetKindTypeNames.root,
                                                    ))
                                            ) {
                                                return empty();
                                            }
                                            return of(d);
                                        }),
                                    );
                                }),
                            );
                    } else if (
                        result.kind === DatasetKindTypeNames.derivative &&
                        result.metadata.currentUpstreamDependencies?.length
                    ) {
                        return this.searchApi
                            .searchLinageDatasetUpstreamDependencies(result.id)
                            .pipe(
                                flatMap((result2: DatasetLinageResponse) => {
                                    this.changeDatasetTree(result2);
                                    return from(
                                        // @ts-ignore
                                        result2.metadata
                                            .currentUpstreamDependencies,
                                    ).pipe(
                                        // @ts-ignore
                                        flatMap((d: DatasetLinageResponse) => {
                                            if (
                                                this.datasetTree.some(
                                                    (
                                                        r: {
                                                            id: string;
                                                            kind: DatasetKindTypeNames;
                                                        }[],
                                                    ) =>
                                                        r[0].id ===
                                                            result2.id &&
                                                        r[0].id === d.id,
                                                )
                                            ) {
                                                return empty();
                                            }
                                            if (
                                                !d.metadata
                                                    .currentUpstreamDependencies
                                                    ?.length ||
                                                (d.metadata
                                                    .currentUpstreamDependencies
                                                    ?.length &&
                                                    // @ts-ignore
                                                    d.metadata.currentUpstreamDependencies.some(
                                                        (
                                                            upDep: DatasetLinageResponse,
                                                        ) =>
                                                            upDep.kind ===
                                                            DatasetKindTypeNames.root,
                                                    )) ||
                                                // @ts-ignore
                                                (d.currentUpstreamDependencies
                                                    ?.length &&
                                                    // @ts-ignore
                                                    d.currentUpstreamDependencies.some(
                                                        (
                                                            upDep: DatasetLinageResponse,
                                                        ) =>
                                                            upDep.kind ===
                                                            DatasetKindTypeNames.root,
                                                    ))
                                            ) {
                                                return empty();
                                            }
                                            return of(d);
                                        }),
                                    );
                                }),
                            );
                    }
                }),
            )
            .subscribe((r: any) => {
                console.log(r);
            });
    }

    public onSearchLinageUpstreamDataset(id: string): void {
        this.searchApi
            .searchLinageDatasetUpstreamDependencies(id)
            .pipe(
                expand((result: DatasetLinageResponse) => {
                    if (
                        result.kind === DatasetKindTypeNames.root &&
                        result.metadata.currentDownstreamDependencies &&
                        result.metadata.currentDownstreamDependencies?.length
                    ) {
                        return of(
                            result.metadata.currentDownstreamDependencies[0].id,
                        );
                    } else if (
                        result.metadata.currentUpstreamDependencies &&
                        result.metadata.currentUpstreamDependencies?.length
                    ) {
                        return of(
                            result.metadata.currentUpstreamDependencies[0].id,
                        );
                    } else {
                        return empty();
                    }
                }),
            )
            .subscribe((r) => {
                console.log(r);
            });
    }

    private changeDatasetTree(dataset: DatasetLinageResponse) {
        if (dataset.metadata.currentUpstreamDependencies) {
            dataset.metadata.currentUpstreamDependencies.forEach(
                (dependencies: DatasetCurrentUpstreamDependencies) => {
                    this.datasetTree.push([
                        { id: dataset.id, kind: dataset.kind },
                        {
                            id: dependencies.id,
                            kind: dependencies.kind,
                        },
                    ]);
                    this.setKindInfo(dataset);
                    this.setKindInfo(dependencies);
                },
            );
        }
        if (dataset.metadata.currentDownstreamDependencies) {
            dataset.metadata.currentDownstreamDependencies.forEach(
                (dependencies: DatasetCurrentUpstreamDependencies) => {
                    this.datasetTree.push([
                        { id: dataset.id, kind: dataset.kind },
                        {
                            id: dependencies.id,
                            kind: dependencies.kind,
                        },
                    ]);
                    this.setKindInfo(dataset);
                    this.setKindInfo(dependencies);
                },
            );
        }
        this.datasetTreeChange(this.datasetTree);
    }

    private uniquedatasetTree(datasetTree: string[][]) {
        return new Map(
            datasetTree.map((p: string[]) => [p.join(), p]),
        ).values();
    }

    private createDependenciesDerivativeList(dataset: DatasetLinageResponse) {
        if (dataset.metadata.currentDownstreamDependencies) {
            return dataset.metadata.currentDownstreamDependencies.filter(
                (dependencies: DatasetCurrentUpstreamDependencies) =>
                    dependencies.kind === DatasetKindTypeNames.derivative,
            );
        }
        if (dataset.metadata.currentUpstreamDependencies) {
            return dataset.metadata.currentUpstreamDependencies.filter(
                (dependencies: DatasetCurrentUpstreamDependencies) =>
                    dependencies.kind === DatasetKindTypeNames.derivative,
            );
        }
    }

    private createDependenciesRootList(dataset: DatasetLinageResponse) {
        if (dataset.metadata.currentDownstreamDependencies) {
            return dataset.metadata.currentDownstreamDependencies.filter(
                (dependencies: DatasetCurrentUpstreamDependencies) =>
                    dependencies.kind === DatasetKindTypeNames.root,
            );
        }
        if (dataset.metadata.currentUpstreamDependencies) {
            return dataset.metadata.currentUpstreamDependencies.filter(
                (dependencies: DatasetCurrentUpstreamDependencies) =>
                    dependencies.kind === DatasetKindTypeNames.root,
            );
        }
    }
}
