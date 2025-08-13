/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { parse } from "yaml";
import { AddPushSourceEditFormType, EditAddPushSourceParseType } from "./add-push-source-form.types";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { Observable } from "rxjs";
import { MetadataManifestFormat } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";

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
