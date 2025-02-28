/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { DatasetService } from "../dataset-view/dataset.service";
import { Observable, EMPTY, iif, of, zip } from "rxjs";
import { expand, last, map, switchMap } from "rxjs/operators";
import { AddPushSource, MetadataBlockFragment } from "../api/kamu.graphql.interface";
import { BlockService } from "../dataset-block/metadata-block/block.service";
import { SupportedEvents } from "../dataset-block/metadata-block/components/event-details/supported.events";
import { DatasetHistoryUpdate } from "../dataset-view/dataset.subscriptions.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { MaybeNull, MaybeNullOrUndefined } from "../interface/app.types";

export abstract class BaseYamlEventService {
    private static readonly HISTORY_PAGE_SIZE = 100;
    private datasetService = inject(DatasetService);
    private blockService = inject(BlockService);
    private currentPage = 0;
    public history: DatasetHistoryUpdate;

    public getEventAsYaml(
        info: DatasetInfo,
        typename: SupportedEvents,
        sourceName: MaybeNull<string> = null,
    ): Observable<MaybeNullOrUndefined<string>> {
        return this.datasetService
            .getDatasetHistory(info, BaseYamlEventService.HISTORY_PAGE_SIZE, this.currentPage)
            .pipe(
                expand((h: DatasetHistoryUpdate) => {
                    const filteredHistory = this.filterHistoryByType(h.history, typename, sourceName);
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
                    const filteredHistory = this.filterHistoryByType(h.history, typename, sourceName);
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

    public filterHistoryByType(
        history: MetadataBlockFragment[],
        typename: SupportedEvents,
        sourceName: MaybeNull<string>,
    ): MetadataBlockFragment[] {
        if (sourceName) {
            return history.filter(
                (item: MetadataBlockFragment) =>
                    item.event.__typename === typename && (item.event as AddPushSource).sourceName === sourceName,
            );
        } else {
            return history.filter((item: MetadataBlockFragment) => item.event.__typename === typename);
        }
    }
}
