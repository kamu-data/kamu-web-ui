/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";

import { Observable } from "rxjs";

import { parseYamlAs } from "@common/helpers/untyped-boundary.helpers";
import { MetadataManifestFormat } from "@api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "@interface/app.types";
import { DataSchemaField } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import {
    AddPushSourceEditFormType,
    EditAddPushSourceParseType,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { ReadControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService {
    private blockService = inject(BlockService);

    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const parsedEvent = parseYamlAs<EditAddPushSourceParseType>(event).content.event;
        return {
            ...parsedEvent,
            read: {
                ...parsedEvent.read,
                schema: parsedEvent.read.schema?.fields ?? [],
            },
        };
    }

    public getEventAsYaml(info: DatasetInfo, sourceName: string): Observable<MaybeNullOrUndefined<string>> {
        return this.blockService.getAddPushSourceBlock({
            ...info,
            sourceName,
            encoding: MetadataManifestFormat.Yaml,
        });
    }

    public patchSchemaField(
        readForm: FormGroup<ReadControls>,
        info: DatasetInfo,
        sourceName: string,
        destroyRef: DestroyRef,
    ): void {
        const schemaControl = readForm.controls.schema;
        if (!schemaControl) return;
        this.blockService
            .getAddPushSourceSchemaFields({ ...info, sourceName })
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe((fields: DataSchemaField[]) => schemaControl.setValue(fields));
    }
}
