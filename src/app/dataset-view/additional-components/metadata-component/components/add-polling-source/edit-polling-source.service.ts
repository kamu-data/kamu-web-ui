import { Injectable } from "@angular/core";
import { EMPTY, Observable, iif, of, zip } from "rxjs";
import { switchMap, map, expand, last } from "rxjs/operators";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { parse } from "yaml";
import {
    EditFormParseType,
    EditFormType,
    FetchKind,
    MergeKind,
    NameValue,
} from "./add-polling-source-form.types";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

@Injectable({
    providedIn: "root",
})
export class EditPollingSourceService {
    private currentPage = 0;
    private readonly PATTERN_CONTROL = "pattern";
    private readonly TIMESTAMP_FORMAT_CONTROL = "timestampFormat";
    private historyPageSize = 100;
    public history: DatasetHistoryUpdate;

    constructor(
        private appDatasetService: DatasetService,
        private blockService: BlockService,
        private fb: FormBuilder,
    ) {}

    public parseEventFromYaml(event: string): EditFormType {
        const editFormParseValue = parse(event) as EditFormParseType;
        return editFormParseValue.content.event;
    }

    public patchFormValues(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
        groupName: SetPollingSourceSection,
    ): void {
        switch (groupName) {
            case SetPollingSourceSection.FETCH: {
                this.patchFetchStep(sectionForm, editFormValue);
                break;
            }
            case SetPollingSourceSection.READ: {
                this.patchReadStep(sectionForm, editFormValue);
                break;
            }
            case SetPollingSourceSection.MERGE: {
                this.patchMergeStep(sectionForm, editFormValue);
                break;
            }
        }
    }

    public getEventAsYaml(
        info: DatasetInfo,
        typename: string,
    ): Observable<string | null | undefined> {
        return this.appDatasetService
            .getDatasetHistory(info, this.historyPageSize, this.currentPage)
            .pipe(
                expand((h: DatasetHistoryUpdate) => {
                    const filteredHistory = this.filterHistoryByType(
                        h.history,
                        typename,
                    );
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
                    const filteredHistory = this.filterHistoryByType(
                        h.history,
                        typename,
                    );
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
                map((result: [string, unknown] | null) => {
                    if (result) return result[0];
                }),
                last(),
            );
    }

    private patchFetchStep(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        this.initFetchCommonControls(sectionForm, editFormValue);
        if (editFormValue.fetch.kind === FetchKind.URL) {
            this.initFetchUrlControls(sectionForm, editFormValue);
        } else if (editFormValue.fetch.kind === FetchKind.CONTAINER) {
            this.initFetchContainerControls(sectionForm, editFormValue);
        }
    }

    private patchReadStep(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        sectionForm.patchValue(editFormValue.read);
        const schema = sectionForm.controls.schema as FormArray;
        if (
            !(schema.value as string[]).length &&
            editFormValue.read.schema &&
            editFormValue.read.schema.length
        ) {
            editFormValue.read.schema.forEach((item) => {
                const result = item.split(" ");
                schema.push(
                    this.fb.group({
                        name: [result[0]],
                        type: [result[1]],
                    }),
                );
            });
        }
    }

    private filterHistoryByType(
        history: MetadataBlockFragment[],
        typename: string,
    ): MetadataBlockFragment[] {
        return history.filter(
            (item: MetadataBlockFragment) => item.event.__typename === typename,
        );
    }

    private patchMergeStep(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        sectionForm.patchValue(editFormValue.merge);
        if (editFormValue.merge.kind !== MergeKind.APPEND) {
            const primaryKey = sectionForm.controls.primaryKey as FormArray;
            editFormValue.merge.primaryKey?.forEach((item) => {
                primaryKey.push(this.fb.control(item));
            });
        }
        if (editFormValue.merge.kind === MergeKind.SNAPSHOT) {
            const compareColumns = sectionForm.controls
                .compareColumns as FormArray;
            editFormValue.merge.compareColumns?.forEach((item) => {
                compareColumns.push(this.fb.control(item));
            });
        }
    }

    private initFetchCommonControls(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        sectionForm.patchValue(editFormValue.fetch);
        const eventTimeGroup = sectionForm.controls.eventTime as FormGroup;
        const pattern = editFormValue.fetch.eventTime?.pattern;
        const timestampFormat = editFormValue.fetch.eventTime?.timestampFormat;
        eventTimeGroup.addControl(
            this.PATTERN_CONTROL,
            this.fb.control(pattern),
        );
        eventTimeGroup.addControl(
            this.TIMESTAMP_FORMAT_CONTROL,
            this.fb.control(timestampFormat),
        );
    }

    private initFetchUrlControls(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        const headers = sectionForm.controls.headers as FormArray;
        if (
            (headers.value as NameValue[]).length == 0 &&
            editFormValue.fetch.headers
        ) {
            this.initNameValueControl(editFormValue.fetch.headers, headers);
        }
    }

    private initFetchContainerControls(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        const env = sectionForm.controls.env as FormArray;
        if (editFormValue.fetch.env) {
            this.initNameValueControl(editFormValue.fetch.env, env);
        }
        const command = sectionForm.controls.command as FormArray;
        editFormValue.fetch.command?.forEach((item) => {
            command.push(this.fb.control(item, RxwebValidators.required()));
        });
        const args = sectionForm.controls.args as FormArray;
        editFormValue.fetch.args?.forEach((item) => {
            args.push(this.fb.control(item, RxwebValidators.required()));
        });
    }

    private initNameValueControl(
        array: NameValue[],
        formArray: FormArray,
    ): void {
        array.forEach((item) => {
            formArray.push(
                this.fb.group({
                    name: [item.name],
                    value: [item.value],
                }),
            );
        });
    }
}
