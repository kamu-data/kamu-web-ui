import { Injectable, inject } from "@angular/core";
import { parse } from "yaml";
import { AddPushSourceEditFormType, EditAddPushSourceParseType } from "./add-push-source-form.types";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { EMPTY, Observable, expand, iif, last, map, of, switchMap, zip } from "rxjs";
import { MaybeNull, MaybeNullOrUndefined } from "src/app/common/app.types";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService {
    private datasetService = inject(DatasetService);
    private blockService = inject(BlockService);
    private currentPage = 0;
    private readonly HISTORY_PAGE_SIZE = 100;
    public history: DatasetHistoryUpdate;

    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const editFormParseValue = parse(event) as EditAddPushSourceParseType;
        return editFormParseValue.content.event;
    }

    public getEventAsYaml(info: DatasetInfo, sourceName: MaybeNull<string>): Observable<MaybeNullOrUndefined<string>> {
        return this.datasetService.getDatasetHistory(info, this.HISTORY_PAGE_SIZE, this.currentPage).pipe(
            expand((h: DatasetHistoryUpdate) => {
                const filteredHistory = this.filterHistoryByType(h.history, sourceName);
                return filteredHistory.length === 0 && h.pageInfo.hasNextPage
                    ? this.datasetService.getDatasetHistory(info, this.HISTORY_PAGE_SIZE, h.pageInfo.currentPage + 1)
                    : EMPTY;
            }),
            map((h: DatasetHistoryUpdate) => {
                this.history = h;
                const filteredHistory = this.filterHistoryByType(h.history, sourceName);
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

    private filterHistoryByType(
        history: MetadataBlockFragment[],
        sourceName: MaybeNull<string>,
    ): MetadataBlockFragment[] {
        return history.filter(
            (item: MetadataBlockFragment) =>
                item.event.__typename === SupportedEvents.AddPushSource && item.event.sourceName === sourceName,
        );
    }
}
