import { Injectable } from "@angular/core";
import { zip } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
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
    private historyLength = 200;
    public history: DatasetHistoryUpdate;

    constructor(
        private appDatasetService: DatasetService,
        private blockService: BlockService,
        private appDatasetSubsService: AppDatasetSubscriptionsService,
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

    public getSetPollingSourceAsYaml(info: DatasetInfo) {
        return this.appDatasetService
            .requestDatasetHistory(info, this.historyLength, this.currentPage)
            .pipe(
                switchMap(
                    () => this.appDatasetSubsService.onDatasetHistoryChanges,
                ),
                map((h: DatasetHistoryUpdate) => {
                    this.history = h;
                    const lastBlock = h.history.filter(
                        (item: MetadataBlockFragment) =>
                            item.event.__typename === "SetPollingSource",
                    )[0];
                    if (typeof lastBlock === "object") {
                        return lastBlock.blockHash as string;
                    }
                    return h.history[0].blockHash as string;
                }),
                switchMap((hash: string) =>
                    zip(
                        this.blockService.onMetadataBlockAsYamlChanges,
                        this.blockService.requestMetadataBlock(info, hash),
                    ),
                ),
            );
    }

    private patchFetchStep(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
    ): void {
        sectionForm.patchValue(editFormValue.fetch);
        const eventTimeGroup = sectionForm.controls.eventTime as FormGroup;
        const pattern = editFormValue.fetch.eventTime?.pattern;
        const timestampFormat = editFormValue.fetch.eventTime?.timestampFormat;
        eventTimeGroup.addControl("pattern", this.fb.control(pattern));
        eventTimeGroup.addControl(
            "timestampFormat",
            this.fb.control(timestampFormat),
        );
        if (editFormValue.fetch.kind === FetchKind.URL) {
            const headers = sectionForm.controls.headers as FormArray;
            if ((headers.value as NameValue[]).length == 0)
                editFormValue.fetch.headers?.forEach((item) => {
                    headers.push(
                        this.fb.group({
                            name: [item.name],
                            value: [item.value],
                        }),
                    );
                });
        } else if (editFormValue.fetch.kind === FetchKind.CONTAINER) {
            const env = sectionForm.controls.env as FormArray;
            editFormValue.fetch.env?.forEach((item) => {
                env.push(
                    this.fb.group({
                        name: [item.name],
                        value: [item.value],
                    }),
                );
            });
            const command = sectionForm.controls.command as FormArray;
            editFormValue.fetch.command?.forEach((item) => {
                command.push(this.fb.control(item, RxwebValidators.required()));
            });
            const args = sectionForm.controls.args as FormArray;
            editFormValue.fetch.args?.forEach((item) => {
                args.push(this.fb.control(item, RxwebValidators.required()));
            });
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
                schema.push(
                    this.fb.group({
                        name: [item.split(" ")[0]],
                        type: [item.split(" ")[1]],
                    }),
                );
            });
        }
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
}
