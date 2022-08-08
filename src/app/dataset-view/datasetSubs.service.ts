import {BehaviorSubject, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {SearchHistoryInterface, SearchOverviewInterface} from "../interface/search.interface";
import {MetadataBlockExtended, Scalars} from "../api/kamu.graphql.interface";
@Injectable()
export class AppDatasetSubsService {
    private datasetOverviewChanges$: BehaviorSubject<SearchHistoryInterface[]> = new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetDataChanges$: BehaviorSubject<SearchHistoryInterface[]> = new BehaviorSubject<SearchHistoryInterface[]>([]);
    private datasetHistoryChanges$: BehaviorSubject<MetadataBlockExtended[]> = new BehaviorSubject<MetadataBlockExtended[]>([]);
    private datasetMetadataChanges$: BehaviorSubject<SearchOverviewInterface> = new BehaviorSubject<SearchOverviewInterface>({} as SearchOverviewInterface);

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

    public changeDatasetHistory(searchData: MetadataBlockExtended[]): void {
        this.datasetHistoryChanges$.next(searchData);
    }

    public get onDatasetHistoryChanges(): Observable<MetadataBlockExtended[]> {
        return this.datasetHistoryChanges$.asObservable();
    }

    public changeDatasetMetadata(searchData: SearchOverviewInterface): void {
        this.datasetMetadataChanges$.next(searchData);
    }

    public get onDatasetMetadataChanges(): Observable<SearchOverviewInterface> {
        return this.datasetMetadataChanges$.asObservable();
    }
}