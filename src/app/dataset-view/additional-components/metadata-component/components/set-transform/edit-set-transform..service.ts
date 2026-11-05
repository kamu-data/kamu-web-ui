/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { parseYamlAs } from "@common/helpers/untyped-boundary.helpers";
import { MetadataManifestFormat } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import {
    EditSetTransformParseType,
    SetTransformEvent,
    SetTransformYamlType,
    TransformQueryStep,
    TransformSelectedInput,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";

@Injectable({
    providedIn: "root",
})
export class EditSetTransformService {
    private blockService = inject(BlockService);

    public parseEventFromYaml(event: string): SetTransformYamlType {
        const editFormParseValue = parseYamlAs<EditSetTransformParseType>(event);
        return editFormParseValue.content.event;
    }

    public getEventAsYaml(info: DatasetInfo): Observable<MaybeNull<string>> {
        return this.blockService.getSetTransformBlock({ ...info, encoding: MetadataManifestFormat.Yaml });
    }

    public transformEventAsObject(
        inputs: TransformSelectedInput[],
        engine: string,
        queries: TransformQueryStep[],
    ): SetTransformEvent {
        return {
            inputs: inputs.map(({ datasetRef, alias }) => ({ datasetRef, alias: alias.trim() })),
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        };
    }
}
