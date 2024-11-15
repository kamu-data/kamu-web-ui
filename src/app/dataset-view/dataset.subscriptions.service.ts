import { Observable, ReplaySubject, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import {
    DatasetHistoryUpdate,
    LineageUpdate,
    MetadataSchemaUpdate,
    OverviewUpdate,
} from "./dataset.subscriptions.interface";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";

@Injectable({ providedIn: "root" })
export class DatasetSubscriptionsService {
    private overview$: Subject<OverviewUpdate> = new ReplaySubject<OverviewUpdate>(1 /*bufferSize*/);
    // private sqlQueryData$: Subject<MaybeNull<DataUpdate>> = new ReplaySubject<MaybeNull<DataUpdate>>(1 /*bufferSize*/);
    // private sqlError$: Subject<DataSqlErrorUpdate> = new ReplaySubject<DataSqlErrorUpdate>(1 /*bufferSize*/);
    private history$: Subject<MaybeNull<DatasetHistoryUpdate>> = new ReplaySubject<MaybeNull<DatasetHistoryUpdate>>(
        1 /*bufferSize*/,
    );
    private metadataSchema$: Subject<MetadataSchemaUpdate> = new ReplaySubject<MetadataSchemaUpdate>(1 /*bufferSize*/);
    private lineage$: Subject<MaybeNull<LineageUpdate>> = new ReplaySubject<MaybeNull<LineageUpdate>>(1 /*bufferSize*/);
    private permissions$: Subject<DatasetPermissionsFragment> = new ReplaySubject<DatasetPermissionsFragment>(
        1 /*bufferSize*/,
    );
    // private involvedSqlDatasetsId$: Subject<string[]> = new ReplaySubject<string[]>(1 /*bufferSize*/);

    public emitOverviewChanged(data: OverviewUpdate): void {
        this.overview$.next(data);
    }

    public get overviewChanges(): Observable<OverviewUpdate> {
        return this.overview$.asObservable();
    }

    // SQL queries

    // public emitSqlQueryDataChanged(dataUpdate: MaybeNull<DataUpdate>): void {
    //     this.sqlQueryData$.next(dataUpdate);
    // }

    // public get sqlQueryDataChanges(): Observable<MaybeNull<DataUpdate>> {
    //     return this.sqlQueryData$.asObservable();
    // }

    // public emitSqlErrorOccurred(dataSqlErrorUpdate: DataSqlErrorUpdate) {
    //     this.sqlError$.next(dataSqlErrorUpdate);
    // }

    // public resetSqlError(): void {
    //     this.emitSqlErrorOccurred({ error: "" });
    // }

    // public get sqlErrorOccurrences(): Observable<DataSqlErrorUpdate> {
    //     return this.sqlError$.asObservable();
    // }

    // public emitInvolvedSqlDatasetsId(ids: string[]): void {
    //     this.involvedSqlDatasetsId$.next(ids);
    // }

    // public get involvedSqlDatasetsIdChanges(): Observable<string[]> {
    //     return this.involvedSqlDatasetsId$.asObservable();
    // }

    // history

    public emitHistoryChanged(historyUpdate: MaybeNull<DatasetHistoryUpdate>): void {
        this.history$.next(historyUpdate);
    }

    public get historyChanges(): Observable<MaybeNull<DatasetHistoryUpdate>> {
        return this.history$.asObservable();
    }

    // metadata

    public emitMetadataSchemaChanged(schema: MetadataSchemaUpdate): void {
        this.metadataSchema$.next(schema);
    }

    public get metadataSchemaChanges(): Observable<MetadataSchemaUpdate> {
        return this.metadataSchema$.asObservable();
    }

    // lineage

    public emitLineageChanged(data: MaybeNull<LineageUpdate>): void {
        this.lineage$.next(data);
    }

    public get lineageChanges(): Observable<MaybeNull<LineageUpdate>> {
        return this.lineage$.asObservable();
    }

    // permissions

    public emitPermissionsChanged(permissions: DatasetPermissionsFragment): void {
        this.permissions$.next(permissions);
    }

    public get permissionsChanges(): Observable<DatasetPermissionsFragment> {
        return this.permissions$.asObservable();
    }
}
