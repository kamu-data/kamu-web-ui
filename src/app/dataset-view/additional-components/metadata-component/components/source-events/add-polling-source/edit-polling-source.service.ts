/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormArray, FormGroup, Validators } from "@angular/forms";

import { Observable } from "rxjs";

import { parseYamlAs } from "@common/helpers/untyped-boundary.helpers";
import { MetadataManifestFormat } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DataSchemaField } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import {
    AddPollingSourceEditFormType,
    EditFormParseType,
    EventTimeSourceKind,
    FetchStepValue,
    MergeStepValue,
    PrepareKind,
    PrepareStepValue,
    ReadKind,
    ReadStepValue,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    FetchControls,
    MergeControls,
    PrepareStepForm,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    decompressStepGroup,
    listItemControl,
    nameValueGroup,
    pipeStepGroup,
    textControl,
    topicGroup,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Injectable({
    providedIn: "root",
})
export class EditPollingSourceService {
    private blockService = inject(BlockService);

    public parseEventFromYaml(event: string): AddPollingSourceEditFormType {
        const editFormParseValue = parseYamlAs<EditFormParseType>(event);
        const parsedEvent = editFormParseValue.content.event;
        return {
            ...parsedEvent,
            read: {
                ...parsedEvent.read,
                schema: parsedEvent.read.schema?.fields ?? [],
            },
        };
    }

    public getEventAsYaml(info: DatasetInfo): Observable<MaybeNull<string>> {
        return this.blockService.getPollingSourceBlock({ ...info, encoding: MetadataManifestFormat.Yaml });
    }

    /** Selects the event's fetch kind, which adds that kind's controls, and fills them from the event. */
    public patchFetchStep(form: FormGroup<FetchControls>, fetch: FetchStepValue): void {
        const { kind, eventTime, headers, env, command, args, topics, cache, ...fields } = fetch;
        form.controls.kind.setValue(kind);
        form.patchValue({ ...fields, cache: Boolean(cache) });
        const eventTimeForm = form.controls.eventTime;
        if (eventTime && eventTimeForm) {
            eventTimeForm.controls.kind.setValue(eventTime.kind);
            if (eventTime.kind === EventTimeSourceKind.FROM_PATH) {
                eventTimeForm.addControl("pattern", textControl(eventTime.pattern ?? "", [Validators.required]));
                eventTimeForm.addControl("timestampFormat", textControl(eventTime.timestampFormat ?? ""));
            }
        }
        headers?.forEach(({ name, value }) => form.controls.headers?.push(nameValueGroup(name, value)));
        env?.forEach(({ name, value }) => form.controls.env?.push(nameValueGroup(name, value)));
        command?.forEach((item) => form.controls.command?.push(listItemControl(item)));
        args?.forEach((item) => form.controls.args?.push(listItemControl(item)));
        topics?.forEach(({ path, qos }) => form.controls.topics?.push(topicGroup(path, qos)));
    }

    /** Fills the prepare step with the event's steps; steps of a kind the editor has no form for are skipped. */
    public patchPrepareStep(form: FormArray<PrepareStepForm>, prepare: PrepareStepValue[] = []): void {
        prepare.forEach((step) => {
            switch (step.kind) {
                case PrepareKind.PIPE:
                    form.push(pipeStepGroup(step.command.join(" ")));
                    break;
                case PrepareKind.DECOMPRESS:
                    form.push(decompressStepGroup(step.format, step.subPath));
                    break;
            }
        });
    }

    /**
     * Fills the read step from the event. The editor offers JSON and GeoJSON as one kind each with a
     * format choice, so `Json` and `NdJson` select `AllJson` with the format in `jsonKind`. With a
     * dataset, the schema comes from the dataset's current source.
     */
    public patchReadStep(
        form: FormGroup<ReadControls>,
        read: ReadStepValue,
        datasetInfo: MaybeNull<DatasetInfo>,
        destroyRef: DestroyRef,
    ): void {
        const { kind, schema, subPath, ...fields } = read;
        const formKind = JSON_KINDS.includes(kind)
            ? ReadKind.All_JSON
            : GEO_JSON_KINDS.includes(kind)
              ? ReadKind.ALL_GEO
              : kind;
        form.controls.kind.setValue(formKind);
        form.patchValue({
            ...fields,
            ...(formKind !== kind ? { jsonKind: kind } : {}),
            ...(schema ? { schema } : {}),
            ...(subPath !== undefined ? { subPath } : {}),
        });
        if (kind === ReadKind.JSON) {
            form.addControl("subPath", textControl(subPath ?? ""));
        }
        const schemaControl = form.controls.schema;
        if (datasetInfo && schemaControl) {
            this.blockService
                .getPollingSourceSchemaFields(datasetInfo)
                .pipe(takeUntilDestroyed(destroyRef))
                .subscribe((schemaFields: DataSchemaField[]) => schemaControl.setValue(schemaFields));
        }
    }

    public patchMergeStep(form: FormGroup<MergeControls>, merge: MergeStepValue): void {
        form.controls.kind.setValue(merge.kind);
        merge.primaryKey?.forEach((item) => form.controls.primaryKey?.push(listItemControl(item)));
        merge.compareColumns?.forEach((item) => form.controls.compareColumns?.push(listItemControl(item)));
    }
}

const JSON_KINDS: readonly ReadKind[] = [ReadKind.JSON, ReadKind.ND_JSON];
const GEO_JSON_KINDS: readonly ReadKind[] = [ReadKind.GEO_JSON, ReadKind.ND_GEO_JSON];
