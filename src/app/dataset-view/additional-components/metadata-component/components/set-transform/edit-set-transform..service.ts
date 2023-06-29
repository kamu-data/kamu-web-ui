import { Injectable } from "@angular/core";
import { Observable, EMPTY, iif, of, zip } from "rxjs";
import { expand, last, map, switchMap } from "rxjs/operators";
import {
    MetadataBlockFragment,
    SetTransform,
    SqlQueryStep,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { parse } from "yaml";
import {
    EditSetTransformParseType,
    SetTransFormYamlType,
} from "./set-transform.types";

@Injectable({
    providedIn: "root",
})
export class EditSetTransformService {
    private currentPage = 0;
    private historyPageSize = 100;
    public history: DatasetHistoryUpdate;

    constructor(
        private appDatasetService: DatasetService,
        private blockService: BlockService,
    ) {}

    public parseEventFromYaml(event: string): SetTransFormYamlType {
        const editFormParseValue = parse(event) as EditSetTransformParseType;
        return editFormParseValue.content.event;
    }

    public parseInputDatasets(datasets: Set<string>): TransformInput[] {
        return Array.from(datasets).map(
            (item) => JSON.parse(item) as TransformInput,
        );
    }

    public transformEventAsObject(
        inputDatasets: Set<string>,
        engine: string,
        queries: Omit<SqlQueryStep, "__typename">[],
    ): Omit<SetTransform, "__typename"> {
        return {
            inputs: this.parseInputDatasets(inputDatasets),
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        } as Omit<SetTransform, "__typename">;
    }

    public getSetTransformAsYaml(
        info: DatasetInfo,
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ): Observable<[string, void] | null> {
        return this.appDatasetService
            .getDatasetHistory(info, this.historyPageSize, this.currentPage)
            .pipe(
                expand((h: DatasetHistoryUpdate) => {
                    const filteredHistory = this.filterHistoryByType(h.history);
                    return filteredHistory.length === 0 &&
                        h.pageInfo.hasNextPage
                        ? this.appDatasetService.getDatasetHistory(
                              info,
                              this.historyPageSize,
                              h.pageInfo.currentPage + 1,
                          )
                        : EMPTY;
                }),
                map((h: DatasetHistoryUpdate) => {
                    this.history = h;
                    const filteredHistory = this.filterHistoryByType(h.history);
                    return filteredHistory;
                }),
                switchMap((filteredHistory: MetadataBlockFragment[]) =>
                    iif(
                        () => !filteredHistory.length,
                        of(null),
                        zip(
                            this.blockService.onMetadataBlockAsYamlChanges,
                            this.blockService.requestMetadataBlock(
                                info,
                                filteredHistory[0]?.blockHash as string,
                            ),
                        ),
                    ),
                ),
                last(),
            );
    }

    private filterHistoryByType(
        history: MetadataBlockFragment[],
    ): MetadataBlockFragment[] {
        return history.filter(
            (item: MetadataBlockFragment) =>
                item.event.__typename === "SetTransform",
        );
    }
}
