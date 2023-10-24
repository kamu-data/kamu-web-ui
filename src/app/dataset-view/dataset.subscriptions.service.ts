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
import { MaybeNull } from "../common/app.types";

@Injectable({ providedIn: "root" })
export class DatasetSubscriptionsService {
    private overviewData$: Subject<OverviewDataUpdate> = new ReplaySubject<OverviewDataUpdate>(1 /*bufferSize*/);
    private queryData$: Subject<DataUpdate> = new ReplaySubject<DataUpdate>(1 /*bufferSize*/);
    private sqlError$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(1 /*bufferSize*/);
    private history$: Subject<MaybeNull<DatasetHistoryUpdate>> = new ReplaySubject<MaybeNull<DatasetHistoryUpdate>>(
        1 /*bufferSize*/,
    );
    private metadataSchema$: Subject<MetadataSchemaUpdate> = new ReplaySubject<MetadataSchemaUpdate>(1 /*bufferSize*/);
    private lineage$: Subject<MaybeNull<LineageUpdate>> = new ReplaySubject<MaybeNull<LineageUpdate>>(1 /*bufferSize*/);
    private permissions$: Subject<DatasetPermissionsFragment> = new ReplaySubject<DatasetPermissionsFragment>(
        1 /*bufferSize*/,
    );

    public emitOverviewDataChanged(data: OverviewDataUpdate): void {
        this.overviewData$.next(data);
    }

    public get overviewDataChanges(): Observable<OverviewDataUpdate> {
        return this.overviewData$.asObservable();
    }

    public emitQueryDataChanged(dataUpdate: DataUpdate): void {
        this.queryData$.next(dataUpdate);
    }

    public get queryDataChanges(): Observable<DataUpdate> {
        return this.queryData$.asObservable();
    }

    public emitSqlErrorOccurred(dataSqlErrorUpdate: DataSqlErrorUpdate) {
        this.sqlError$.next(dataSqlErrorUpdate);
    }

    public resetSqlError(): void {
        this.emitSqlErrorOccurred({ error: "" });
    }

    public get sqlErrorOccurrences(): Observable<DataSqlErrorUpdate> {
        return this.sqlError$.asObservable();
    }

    public emitHistoryChanged(historyUpdate: MaybeNull<DatasetHistoryUpdate>): void {
        this.history$.next(historyUpdate);
    }

    public get historyChanges(): Observable<MaybeNull<DatasetHistoryUpdate>> {
        return this.history$.asObservable();
    }

    public emitMetadataSchemaChanged(schema: MetadataSchemaUpdate): void {
        this.metadataSchema$.next(schema);
    }

    public get metadataSchemaChanges(): Observable<MetadataSchemaUpdate> {
        return this.metadataSchema$.asObservable();
    }

    public emitLineageChanged(data: MaybeNull<LineageUpdate>): void {
        this.lineage$.next(data);
    }

    public get lineageChanges(): Observable<MaybeNull<LineageUpdate>> {
        return this.lineage$.asObservable();
    }

    public emitPermissionsChanged(permissions: DatasetPermissionsFragment): void {
        this.permissions$.next(permissions);
    }

    public get permissionsChanges(): Observable<DatasetPermissionsFragment> {
        return this.permissions$.asObservable();
    }
}
