import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { DataViewSchema } from "../interface/search.interface";
import { MetadataBlockFragment } from "../api/kamu.graphql.interface";
@Injectable()
export class AppDatasetSubsService {
    private datasetOverviewDataChanges$: BehaviorSubject<Object[]> =
        new BehaviorSubject<Object[]>([]);
    private datasetDataChanges$: BehaviorSubject<Object[]> =
        new BehaviorSubject<Object[]>([]);
    private datasetHistoryChanges$: BehaviorSubject<MetadataBlockFragment[]> =
        new BehaviorSubject<MetadataBlockFragment[]>([]);

    private dataQuerySchemaChanges$: Subject<DataViewSchema> =
        new Subject<DataViewSchema>();
    private metadataSchemaChanges$: Subject<DataViewSchema> =
        new Subject<DataViewSchema>();

    public changeDatasetOverviewData(data: Object[]): void {
        this.datasetOverviewDataChanges$.next(data);
    }

    public get onDatasetOverviewDataChanges(): Observable<Object[]> {
        return this.datasetOverviewDataChanges$.asObservable();
    }

    public changeDatasetData(searchData: Object[]): void {
        this.datasetDataChanges$.next(searchData);
    }

    public get onDatasetDataChanges(): Observable<Object[]> {
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
