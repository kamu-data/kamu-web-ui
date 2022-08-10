import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import {
    DataViewSchema,
    SearchHistoryInterface,
} from "../interface/search.interface";
import { MetadataBlockFragment } from "../api/kamu.graphql.interface";
@Injectable()
export class AppDatasetSubsService {
    private datasetOverviewChanges$: BehaviorSubject<SearchHistoryInterface[]> =
        new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetDataChanges$: BehaviorSubject<SearchHistoryInterface[]> =
        new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetHistoryChanges$: BehaviorSubject<MetadataBlockFragment[]> =
        new BehaviorSubject<MetadataBlockFragment[]>([]);

    private dataQuerySchemaChanges$: Subject<DataViewSchema> =
        new Subject<DataViewSchema>();
    private metadataSchemaChanges$: Subject<DataViewSchema> =
        new Subject<DataViewSchema>();

    public changeDatasetOverview(searchData: SearchHistoryInterface[]): void {
        this.datasetOverviewChanges$.next(searchData);
    }

    public get onDatasetOverviewChanges(): Observable<
        SearchHistoryInterface[]
    > {
        return this.datasetOverviewChanges$.asObservable();
    }

    public changeDatasetData(searchData: SearchHistoryInterface[]): void {
        this.datasetDataChanges$.next(searchData);
    }

    public get onDatasetDataChanges(): Observable<SearchHistoryInterface[]> {
        return this.datasetDataChanges$.asObservable();
    }

    public changeDatasetHistory(searchData: MetadataBlockFragment[]): void {
        this.datasetHistoryChanges$.next(searchData);
    }

    public get onDatasetHistoryChanges(): Observable<MetadataBlockFragment[]> {
        return this.datasetHistoryChanges$.asObservable();
    }

    public get onDataQuerySchemaChanges(): Observable<DataViewSchema> {
        return this.dataQuerySchemaChanges$.asObservable();
    }

    public dataQuerySchemaChanges(schema: DataViewSchema): void {
        this.dataQuerySchemaChanges$.next(schema);
    }

    public get onMetadataSchemaChanges(): Observable<DataViewSchema> {
        return this.metadataSchemaChanges$.asObservable();
    }

    public metadataSchemaChanges(schema: DataViewSchema): void {
        this.metadataSchemaChanges$.next(schema);
    }
}
