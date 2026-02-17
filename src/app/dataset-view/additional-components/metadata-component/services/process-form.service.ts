/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { AddPushSource, SetPollingSource } from "@api/kamu.graphql.interface";
import AppValues from "@common/values/app.values";

import { SchemaType } from "../components/form-components/schema-field/schema-field.component";
import {
    AddPollingSourceEditFormType,
    EventTimeSourceKind,
    FetchKind,
    PrepareKind,
    SetPollingSourceSection,
    TopicsType,
} from "../components/source-events/add-polling-source/add-polling-source-form.types";
import {
    OrderControlType,
    SchemaControlType,
    SourceOrder,
} from "../components/source-events/add-polling-source/process-form.service.types";
import { AddPushSourceSection } from "../components/source-events/add-push-source/add-push-source-form.types";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformForm(formGroup: FormGroup): void {
        this.transformSchema(formGroup);
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
        const form = formGroup.value as AddPollingSourceEditFormType;
        if (form.fetch.chainId) {
            form.fetch.chainId = +form.fetch.chainId;
        }
    }

    private transformSchema(formGroup: FormGroup): void {
        const form = formGroup.value as SchemaControlType;
        if (form.read.schema?.length && typeof form.read.schema[0] !== "string") {
            form.read.schema = (form.read.schema as SchemaType[]).map((item) => {
                return `${this.processSchemaName(item.name.trim())} ${item.type}`;
            });
        }
    }

    private processPipeCommandControl(formGroup: FormGroup): void {
        const form = formGroup.value as AddPollingSourceEditFormType;
        if (form.prepare && form.prepare.length > 0) {
            form.prepare.map((item) => {
                if (item.kind === PrepareKind.PIPE && typeof item.command === "string") {
                    item.command = item.command.trim().match(AppValues.SPLIT_ARGUMENTS_PATTERN) as string[];
                }
                if (item.kind === PrepareKind.DECOMPRESS && !item.subPath) {
                    delete item.subPath;
                }
            });
        }
    }

    private processEmptyPrepareStep(formGroup: FormGroup): void {
        const form = formGroup.value as AddPollingSourceEditFormType;
        if (form.prepare && !form.prepare.length) {
            delete form.prepare;
        }
    }

    private processEventTimeControl(formGroup: FormGroup): void {
        const form = formGroup.value as OrderControlType;
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
        const form = formGroup.value as OrderControlType;
        if (form.fetch.order === SourceOrder.NONE) {
            delete form.fetch.order;
        }
    }

    private removePushSourceEmptyControls(formGroup: FormGroup): void {
        const form = formGroup.value as AddPushSource;
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
        const form = formGroup.value as SetPollingSource;
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

        if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            formGroup.value[SetPollingSourceSection.FETCH].kind !== FetchKind.CONTAINER &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            formGroup.value[SetPollingSourceSection.FETCH].eventTime &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            !formGroup.value[SetPollingSourceSection.FETCH].eventTime.timestampFormat
        ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            delete formGroup.value[SetPollingSourceSection.FETCH].eventTime.timestampFormat;
        }

        if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            formGroup.value[SetPollingSourceSection.FETCH].kind === FetchKind.MQTT &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            formGroup.value[SetPollingSourceSection.FETCH].topics
        ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (formGroup.value[SetPollingSourceSection.FETCH].topics as TopicsType[]).forEach((item: TopicsType) => {
                if (!item.qos) {
                    delete item.qos;
                }
            });
        }
    }

    private processSchemaName(name: string): string {
        return /\s/.test(name) ? `\`${name}\`` : name;
    }
}
