/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

import AppValues from "@common/values/app.values";

import {
    AddPollingSourceEditFormType,
    EventTimeSourceKind,
    EventTimeValue,
    FetchKind,
    FetchStepValue,
    MergeStepValue,
    PrepareKind,
    PrepareStepValue,
    ReadStepValue,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { AddPushSourceEditFormType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import {
    PollingSourceControls,
    PushSourceControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

export type PollingSourceFormValue = ReturnType<FormGroup<PollingSourceControls>["getRawValue"]>;
export type PushSourceFormValue = ReturnType<FormGroup<PushSourceControls>["getRawValue"]>;
type FetchFormValue = PollingSourceFormValue["fetch"];
type PrepareFormValue = PollingSourceFormValue["prepare"][number];

/** Fetch kinds that take no event time: their data carries it, or they assign the system time. */
const KINDS_WITHOUT_EVENT_TIME: readonly FetchKind[] = [FetchKind.CONTAINER, FetchKind.MQTT, FetchKind.ETHEREUM_LOGS];

/** Turns the source event editor's form values into the events they describe. */
@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public pollingSourceEvent(value: PollingSourceFormValue): AddPollingSourceEditFormType {
        const prepare = value.prepare.map((step) => this.prepareStep(step));
        return {
            fetch: this.fetchStep(value.fetch),
            ...(prepare.length ? { prepare } : {}),
            read: this.readStep(value.read),
            merge: this.mergeStep(value.merge),
        };
    }

    public pushSourceEvent(value: PushSourceFormValue): AddPushSourceEditFormType {
        return {
            sourceName: value.sourceName,
            read: this.readStep(value.read),
            merge: this.mergeStep(value.merge),
        };
    }

    /** Fields to leave out are `undefined`, which the YAML omits, so the rest keep their order. */
    private fetchStep(fetch: FetchFormValue): FetchStepValue {
        const { eventTime, port, chainId, cache, order, topics, env } = fetch;
        return {
            ...withoutEmptyValues(fetch),
            kind: fetch.kind,
            eventTime:
                eventTime && !KINDS_WITHOUT_EVENT_TIME.includes(fetch.kind) ? this.eventTime(eventTime) : undefined,
            port: typeof port === "number" && port ? port : undefined,
            chainId: typeof chainId === "number" && chainId ? chainId : undefined,
            cache: cache ? { kind: "Forever" } : undefined,
            order: order && order !== SourceOrder.NONE ? order : undefined,
            topics: topics?.length ? topics.map(({ path, qos }) => ({ path, qos: qos || undefined })) : undefined,
            env: env?.length ? env.map(({ name, value }) => ({ name, value: value || undefined })) : undefined,
        };
    }

    private eventTime({ kind, pattern, timestampFormat }: EventTimeValue): EventTimeValue {
        if (kind !== EventTimeSourceKind.FROM_PATH) {
            return { kind };
        }
        return { kind, pattern, timestampFormat: timestampFormat || undefined };
    }

    private prepareStep(step: PrepareFormValue): PrepareStepValue {
        switch (step.kind) {
            case PrepareKind.PIPE:
                return { kind: step.kind, command: step.command.trim().match(AppValues.SPLIT_ARGUMENTS_PATTERN) ?? [] };
            case PrepareKind.DECOMPRESS:
                return { kind: step.kind, format: step.format, subPath: step.subPath || undefined };
        }
    }

    private readStep(read: PollingSourceFormValue["read"]): ReadStepValue {
        return { ...withoutEmptyValues(read), kind: read.kind };
    }

    private mergeStep(merge: PollingSourceFormValue["merge"]): MergeStepValue {
        return { ...withoutEmptyValues(merge), kind: merge.kind };
    }
}

/** The fields of `section` that hold something: no `""`, `false`, `0`, `null`, `undefined` or empty list. */
function withoutEmptyValues<V extends object>(section: V): Partial<V> {
    const result: Partial<V> = {};
    for (const key in section) {
        const value = section[key];
        if (value && !(Array.isArray(value) && value.length === 0)) {
            result[key] = value;
        }
    }
    return result;
}
