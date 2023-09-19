import { Observable, ReplaySubject, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import {
    DataSqlErrorUpdate,
    DatasetHistoryUpdate,
    DataUpdate,
    LineageUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./dataset.subscriptions.interface";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class DatasetSubscriptionsService {
    private datasetOverviewDataChanges$: Subject<OverviewDataUpdate> = new ReplaySubject<OverviewDataUpdate>(
        1 /*bufferSize*/,
    );
    private datasetDataChanges$: Subject<DataUpdate> = new ReplaySubject<DataUpdate>(1 /*bufferSize*/);
    private datasetDataSqlErrorOccurred$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(
        1 /*bufferSize*/,
    );
    private datasetHistoryChanges$: Subject<DatasetHistoryUpdate> = new ReplaySubject<DatasetHistoryUpdate>(
        1 /*bufferSize*/,
    );
    private metadataSchemaChanges$: Subject<MetadataSchemaUpdate> = new ReplaySubject<MetadataSchemaUpdate>(
        1 /*bufferSize*/,
    );
    private lineageChanges$: Subject<LineageUpdate> = new ReplaySubject<LineageUpdate>(1 /*bufferSize*/);
    private datasetPermissionChanges$: Subject<DatasetPermissionsFragment> =
        new ReplaySubject<DatasetPermissionsFragment>(1 /*bufferSize*/);

    public changeDatasetOverviewData(data: OverviewDataUpdate): void {
        this.datasetOverviewDataChanges$.next(data);
    }

    public get onDatasetOverviewDataChanges(): Observable<OverviewDataUpdate> {
        return this.datasetOverviewDataChanges$.asObservable();
    }

    public changeDatasetData(dataUpdate: DataUpdate): void {
        this.datasetDataChanges$.next(dataUpdate);
    }

    public get onDatasetDataChanges(): Observable<DataUpdate> {
        return this.datasetDataChanges$.asObservable();
    }

    public observeSqlErrorOccurred(dataSqlErrorUpdate: DataSqlErrorUpdate) {
        this.datasetDataSqlErrorOccurred$.next(dataSqlErrorUpdate);
    }

    public resetSqlError(): void {
        this.observeSqlErrorOccurred({ error: "" });
    }

    public get onDatasetDataSqlErrorOccurred(): Observable<DataSqlErrorUpdate> {
        return this.datasetDataSqlErrorOccurred$.asObservable();
    }

    public changeDatasetHistory(historyUpdate: DatasetHistoryUpdate): void {
        this.datasetHistoryChanges$.next(historyUpdate);
    }

    public get onDatasetHistoryChanges(): Observable<DatasetHistoryUpdate> {
        return this.datasetHistoryChanges$.asObservable();
    }

    public get onMetadataSchemaChanges(): Observable<MetadataSchemaUpdate> {
        return this.metadataSchemaChanges$.asObservable();
    }

    public metadataSchemaChanges(schema: MetadataSchemaUpdate): void {
        this.metadataSchemaChanges$.next(schema);
    }

    public changeLineageData(data: LineageUpdate): void {
        this.lineageChanges$.next(data);
    }

    public get onLineageDataChanges(): Observable<LineageUpdate> {
        return this.lineageChanges$.asObservable();
    }

    public changePermissionsData(permissions: DatasetPermissionsFragment): void {
        this.datasetPermissionChanges$.next(permissions);
    }

    public get onPermissionsDataChanges(): Observable<DatasetPermissionsFragment> {
        return this.datasetPermissionChanges$.asObservable();
    }
}
