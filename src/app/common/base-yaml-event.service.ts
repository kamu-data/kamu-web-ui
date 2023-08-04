import { inject } from "@angular/core";
import { DatasetService } from "../dataset-view/dataset.service";
import { Observable, EMPTY, iif, of, zip, Subject } from "rxjs";
import { expand, last, map, switchMap } from "rxjs/operators";
import { DatasetKind, MetadataBlockFragment } from "../api/kamu.graphql.interface";
import { BlockService } from "../dataset-block/metadata-block/block.service";
import { SupportedEvents } from "../dataset-block/metadata-block/components/event-details/supported.events";
import { DatasetHistoryUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetInfo } from "../interface/navigation.interface";

export abstract class BaseYamlEventService {
    private appDatasetService = inject(DatasetService);
    private blockService = inject(BlockService);
    private currentPage = 0;
    private readonly historyPageSize = 100;
    public history: DatasetHistoryUpdate;
    private kindChanges$: Subject<DatasetKind> = new Subject<DatasetKind>();
    public changeKindChanges(data: DatasetKind): void {
        this.kindChanges$.next(data);
    }
    public get onKindChanges(): Observable<DatasetKind> {
        return this.kindChanges$.asObservable();
    }

    public getEventAsYaml(info: DatasetInfo, typename: SupportedEvents): Observable<string | null | undefined> {
        return this.appDatasetService.getDatasetHistory(info, this.historyPageSize, this.currentPage).pipe(
            expand((h: DatasetHistoryUpdate) => {
                const filteredHistory = this.filterHistoryByType(h.history, typename);
                return filteredHistory.length === 0 && h.pageInfo.hasNextPage
                    ? this.appDatasetService.getDatasetHistory(info, this.historyPageSize, h.pageInfo.currentPage + 1)
                    : EMPTY;
            }),
            map((h: DatasetHistoryUpdate) => {
                if (h.kind) {
                    this.changeKindChanges(h.kind);
                }
                this.history = h;
                const filteredHistory = this.filterHistoryByType(h.history, typename);
                return filteredHistory;
            }),
            switchMap((filteredHistory: MetadataBlockFragment[]) =>
                iif(
                    () => !filteredHistory.length,
                    of(null),
                    zip(
                        this.blockService.onMetadataBlockAsYamlChanges,
                        this.blockService.requestMetadataBlock(info, filteredHistory[0]?.blockHash as string),
                    ),
                ),
            ),
            map((result: [string, unknown] | null) => {
                if (result) return result[0];
                else return null;
            }),
            last(),
        );
    }

    private filterHistoryByType(history: MetadataBlockFragment[], typename: string): MetadataBlockFragment[] {
        return history.filter((item: MetadataBlockFragment) => item.event.__typename === typename);
    }
}
