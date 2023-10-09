import { inject } from "@angular/core";
import { DatasetService } from "../dataset-view/dataset.service";
import { Observable, EMPTY, iif, of, zip } from "rxjs";
import { expand, last, map, switchMap } from "rxjs/operators";
import { MetadataBlockFragment } from "../api/kamu.graphql.interface";
import { BlockService } from "../dataset-block/metadata-block/block.service";
import { SupportedEvents } from "../dataset-block/metadata-block/components/event-details/supported.events";
import { DatasetHistoryUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { MaybeNull, MaybeNullOrUndefined } from "./app.types";

export abstract class BaseYamlEventService {
    private static readonly HISTORY_PAGE_SIZE = 100;

    private datasetService = inject(DatasetService);
    private blockService = inject(BlockService);

    private currentPage = 0;
    public history: MaybeNull<DatasetHistoryUpdate> = null;

    public getEventAsYaml(info: DatasetInfo, typename: SupportedEvents): Observable<MaybeNullOrUndefined<string>> {
        return this.datasetService
            .getDatasetHistory(info, BaseYamlEventService.HISTORY_PAGE_SIZE, this.currentPage)
            .pipe(
                expand((h: DatasetHistoryUpdate) => {
                    const filteredHistory = this.filterHistoryByType(h.history, typename);
                    return filteredHistory.length === 0 && h.pageInfo.hasNextPage
                        ? this.datasetService.getDatasetHistory(
                              info,
                              BaseYamlEventService.HISTORY_PAGE_SIZE,
                              h.pageInfo.currentPage + 1,
                          )
                        : EMPTY;
                }),
                map((h: DatasetHistoryUpdate) => {
                    this.history = h;
                    const filteredHistory = this.filterHistoryByType(h.history, typename);
                    return filteredHistory;
                }),
                switchMap((filteredHistory: MetadataBlockFragment[]) =>
                    iif(
                        () => !filteredHistory.length,
                        of(null),
                        zip(
                            this.blockService.metadataBlockAsYamlChanges,
                            this.blockService.requestMetadataBlock(info, filteredHistory[0]?.blockHash),
                        ),
                    ),
                ),
                map((result: MaybeNull<[string, unknown]>) => {
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
