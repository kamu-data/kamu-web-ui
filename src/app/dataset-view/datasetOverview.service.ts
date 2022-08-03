import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {SearchHistoryInterface, SearchOverviewInterface} from "../interface/search.interface";
@Injectable()
export class AppDatasetOverviewService {
    private datasetOverviewChanges$: BehaviorSubject<SearchHistoryInterface[]> = new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetDataChanges$: BehaviorSubject<SearchHistoryInterface[]> = new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetHistoryChanges$: BehaviorSubject<SearchHistoryInterface[]> = new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetMetadataChanges$: BehaviorSubject<SearchOverviewInterface> = new BehaviorSubject<SearchOverviewInterface>({} as SearchOverviewInterface);
    private datasetDataSQLChanges$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    public changeDatasetOverview(searchData: SearchHistoryInterface[]): void {
        this.datasetOverviewChanges$.next(searchData);
    }

    public get onDatasetOverviewChanges(): Observable<SearchHistoryInterface[]> {
        return this.datasetOverviewChanges$.asObservable();
    }

    public changeDatasetData(searchData: SearchHistoryInterface[]): void {
        this.datasetDataChanges$.next(searchData);
    }

    public get onDatasetDataChanges(): Observable<SearchHistoryInterface[]> {
        return this.datasetDataChanges$.asObservable();
    }

    // TODO
    // Should be changed after new code generation configuration by creating codegen.yml
    public changeDatasetHistory(searchData: any[]): void {
        this.datasetHistoryChanges$.next(searchData);
    }

    public get onDatasetHistoryChanges(): Observable<SearchHistoryInterface[]> {
        return this.datasetHistoryChanges$.asObservable();
    }

    public changeDatasetMetadata(searchData: SearchOverviewInterface): void {
        this.datasetMetadataChanges$.next(searchData);
    }

    public get onDatasetMetadataChanges(): Observable<SearchOverviewInterface> {
        return this.datasetMetadataChanges$.asObservable();
    }

    // TODO
    // Should be changed after new code generation configuration by creating codegen.yml
    public changeDatasetDataSQL(datasets: any[]): void {
        this.datasetDataSQLChanges$.next(datasets);
    }

    // TODO
    // Should be changed after new code generation configuration by creating codegen.yml
    public get onDatasetDataSQLChanges(): Observable<any[]> {
        return this.datasetDataSQLChanges$.asObservable();
    }
}