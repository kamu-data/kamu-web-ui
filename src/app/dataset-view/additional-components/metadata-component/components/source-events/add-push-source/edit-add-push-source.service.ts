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
import { Observable, map } from "rxjs";
import { MetadataManifestFormat, MetadataBlockExtended, AddPushSource } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class EditAddPushSourceService {
    private blockService = inject(BlockService);
    private navigationService = inject(NavigationService);
    public sourceNames: string[] = [];

    public parseEventFromYaml(event: string): AddPushSourceEditFormType {
        const editFormParseValue = parse(event) as EditAddPushSourceParseType;
        return editFormParseValue.content.event;
    }

    public getEventAsYaml(info: DatasetInfo, sourceName: string): Observable<MaybeNull<string>> {
        return this.blockService
            .requestBlocksByAddPushSourceEvent({ ...info, encoding: MetadataManifestFormat.Yaml })
            .pipe(
                map((blocks: MetadataBlockExtended[]) => {
                    this.sourceNames = blocks.map((item) => (item.event as AddPushSource).sourceName);
                    if (sourceName) {
                        if (!this.sourceNames.includes(sourceName)) {
                            this.navigationService.navigateToPageNotFound();
                        }
                        const block = blocks.filter(
                            (item) => item.event.__typename === "AddPushSource" && item.event.sourceName === sourceName,
                        )[0];
                        return block.encoded?.content as string;
                    } else {
                        return null;
                    }
                }),
            );
    }
}
