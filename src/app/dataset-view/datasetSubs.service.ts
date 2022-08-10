import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { DataViewSchema } from "../interface/search.interface";
import {
    DatasetHistoryUpdate,
    MetadataSchemaUpdate,
} from "./datasetSubs.interface";
@Injectable()
export class AppDatasetSubsService {
    private datasetOverviewDataChanges$: BehaviorSubject<Object[]> =
        new BehaviorSubject<Object[]>([]);
    private datasetDataChanges$: BehaviorSubject<Object[]> =
        new BehaviorSubject<Object[]>([]);
    private datasetHistoryChanges$: Subject<DatasetHistoryUpdate> =
        new Subject<DatasetHistoryUpdate>();
    private dataQuerySchemaChanges$: Subject<DataViewSchema> =
        new Subject<DataViewSchema>();
    private metadataSchemaChanges$: Subject<MetadataSchemaUpdate> =
        new Subject<MetadataSchemaUpdate>();

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

    public changeDatasetHistory(historyUpdate: DatasetHistoryUpdate): void {
        this.datasetHistoryChanges$.next(historyUpdate);
    }

    public get onDatasetHistoryChanges(): Observable<DatasetHistoryUpdate> {
        return this.datasetHistoryChanges$.asObservable();
    }

    public get onDataQuerySchemaChanges(): Observable<DataViewSchema> {
        return this.dataQuerySchemaChanges$.asObservable();
    }

    public dataQuerySchemaChanges(schema: DataViewSchema): void {
        this.dataQuerySchemaChanges$.next(schema);
    }

    public get onMetadataSchemaChanges(): Observable<MetadataSchemaUpdate> {
        return this.metadataSchemaChanges$.asObservable();
    }

    public metadataSchemaChanges(schema: MetadataSchemaUpdate): void {
        this.metadataSchemaChanges$.next(schema);
    }
}
