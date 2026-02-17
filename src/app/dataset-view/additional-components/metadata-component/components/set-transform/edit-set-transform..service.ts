/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { MetadataManifestFormat, SetTransform, SqlQueryStep, TransformInput } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { parse } from "yaml";

import { EditSetTransformParseType, SetTransformYamlType } from "./set-transform.types";

@Injectable({
    providedIn: "root",
})
export class EditSetTransformService {
    private blockService = inject(BlockService);

    public parseEventFromYaml(event: string): SetTransformYamlType {
        const editFormParseValue = parse(event) as EditSetTransformParseType;
        return editFormParseValue.content.event;
    }

    public parseInputDatasets(datasets: Set<string>): TransformInput[] {
        return Array.from(datasets).map((item) => JSON.parse(item) as TransformInput);
    }

    public getEventAsYaml(info: DatasetInfo): Observable<MaybeNull<string>> {
        return this.blockService.getSetTransformBlock({ ...info, encoding: MetadataManifestFormat.Yaml });
    }

    public transformEventAsObject(
        inputDatasets: Set<string>,
        engine: string,
        queries: Omit<SqlQueryStep, "__typename">[],
    ): Omit<SetTransform, "__typename"> {
        return {
            inputs: this.parseInputDatasets(inputDatasets),
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        } as Omit<SetTransform, "__typename">;
    }

    // private transformInputsDatasets(
    //     inputs: TransformInput[],
    //     owners: string[],
    // ): TransformInput[] {
    //     return inputs.map((item: TransformInput, index: number) => {
    //         return { ...item, name: `${owners[index]}/${item.name as string}` };
    //     });
    // }
}
