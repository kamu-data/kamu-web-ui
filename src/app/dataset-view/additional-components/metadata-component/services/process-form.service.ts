/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { formValueAs } from "@common/helpers/untyped-boundary.helpers";
import AppValues from "@common/values/app.values";
import { AddPushSource, SetPollingSource } from "@api/kamu.graphql.interface";

import {
    AddPollingSourceEditFormType,
    EventTimeSourceKind,
    FetchKind,
    PrepareKind,
    SetPollingSourceSection,
    TopicsType,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    OrderControlType,
    SourceOrder,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { AddPushSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformForm(formGroup: FormGroup): void {
        this.processEmptyPrepareStep(formGroup);
        if ("fetch" in formGroup.value) {
            this.processFetchOrderControl(formGroup);
            this.processEventTimeControl(formGroup);
            this.processPipeCommandControl(formGroup);
            this.removePollingSourceEmptyControls(formGroup);
            this.changeTypeChainIdControl(formGroup);
            return;
        }
        this.removePushSourceEmptyControls(formGroup);
    }

    private changeTypeChainIdControl(formGroup: FormGroup): void {
        const form = formValueAs<AddPollingSourceEditFormType>(formGroup);
        if (form.fetch.chainId) {
            form.fetch.chainId = +form.fetch.chainId;
        }
    }

    private processPipeCommandControl(formGroup: FormGroup): void {
        const form = formValueAs<AddPollingSourceEditFormType>(formGroup);
        if (form.prepare && form.prepare.length > 0) {
            form.prepare.map((item) => {
                if (item.kind === PrepareKind.PIPE && typeof item.command === "string") {
                    item.command = item.command.trim().match(AppValues.SPLIT_ARGUMENTS_PATTERN) ?? [];
                }
                if (item.kind === PrepareKind.DECOMPRESS && !item.subPath) {
                    delete item.subPath;
                }
            });
        }
    }

    private processEmptyPrepareStep(formGroup: FormGroup): void {
        const form = formValueAs<AddPollingSourceEditFormType>(formGroup);
        if (form.prepare && !form.prepare.length) {
            delete form.prepare;
        }
    }

    private processEventTimeControl(formGroup: FormGroup): void {
        const form = formValueAs<OrderControlType>(formGroup);
        if (
            form.fetch.eventTime &&
            [FetchKind.CONTAINER, FetchKind.MQTT, FetchKind.ETHEREUM_LOGS].includes(form.fetch.kind)
        ) {
            delete form.fetch.eventTime;
        }
        if (form.fetch.eventTime?.kind !== EventTimeSourceKind.FROM_PATH) {
            delete form.fetch.eventTime?.pattern;
            delete form.fetch.eventTime?.timestampFormat;
        }
    }

    private processFetchOrderControl(formGroup: FormGroup): void {
        const form = formValueAs<OrderControlType>(formGroup);
        if (form.fetch.order === SourceOrder.NONE) {
            delete form.fetch.order;
        }
    }

    private removePushSourceEmptyControls(formGroup: FormGroup): void {
        const form = formValueAs<AddPushSource>(formGroup);
        type FormKeys = AddPushSourceSection.READ | AddPushSourceSection.MERGE;
        const formKeys: FormKeys[] = [AddPushSourceSection.READ, AddPushSourceSection.MERGE];
        formKeys.forEach((formKey: FormKeys) => {
            Object.entries(form[formKey]).forEach(([key, value]) => {
                if (!value || (Array.isArray(value) && !value.length)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
                    delete formGroup.value[formKey][key];
                }
            });
        });
    }

    private removePollingSourceEmptyControls(formGroup: FormGroup): void {
        const form = formValueAs<SetPollingSource>(formGroup);
        type FormKeys = SetPollingSourceSection.READ | SetPollingSourceSection.MERGE | SetPollingSourceSection.FETCH;
        const formKeys: FormKeys[] = [
            SetPollingSourceSection.READ,
            SetPollingSourceSection.MERGE,
            SetPollingSourceSection.FETCH,
        ];
        formKeys.forEach((formKey: FormKeys) => {
            Object.entries(form[formKey]).forEach(([key, value]) => {
                if (!value || (Array.isArray(value) && !value.length)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
                    delete formGroup.value[formKey][key];
                }
            });
        });

        const fetch = formValueAs<AddPollingSourceEditFormType>(formGroup).fetch;
        if (fetch.kind !== FetchKind.CONTAINER && fetch.eventTime && !fetch.eventTime.timestampFormat) {
            delete fetch.eventTime.timestampFormat;
        }

        if (fetch.kind === FetchKind.MQTT && fetch.topics) {
            fetch.topics.forEach((item: TopicsType) => {
                if (!item.qos) {
                    delete item.qos;
                }
            });
        }
    }
}
