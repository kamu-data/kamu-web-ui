/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { parse } from "yaml";

import { MetadataManifestFormat } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import {
    AddPushSourceEditFormType,
    EditAddPushSourceParseType,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService {
    private blockService = inject(BlockService);

    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const editFormParseValue = parse(event) as EditAddPushSourceParseType;
        return editFormParseValue.content.event;
    }

    public getEventAsYaml(info: DatasetInfo, sourceName: string): Observable<MaybeNull<string>> {
        return this.blockService.getAddPushSourceBlock({
            ...info,
            sourceName,
            encoding: MetadataManifestFormat.Yaml,
        });
    }
}
