import { Observable, ReplaySubject, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import {
    DatasetHistoryUpdate,
    DataUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./datasetSubs.interface";
@Injectable()
export class AppDatasetSubsService {
    private datasetOverviewDataChanges$: Subject<OverviewDataUpdate> =
        new ReplaySubject<OverviewDataUpdate>(1 /*bufferSize*/);
    private datasetDataChanges$: Subject<DataUpdate> =
        new ReplaySubject<DataUpdate>(1 /*bufferSize*/);
    private datasetHistoryChanges$: Subject<DatasetHistoryUpdate> =
        new ReplaySubject<DatasetHistoryUpdate>(1 /*bufferSize*/);
    private metadataSchemaChanges$: Subject<MetadataSchemaUpdate> =
        new ReplaySubject<MetadataSchemaUpdate>(1 /*bufferSize*/);

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
}
