/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
    AddPushSource,
    MetadataBlockExtended,
    MetadataEventType,
    MetadataManifestFormat,
} from "../api/kamu.graphql.interface";
import { BlockService } from "../dataset-block/metadata-block/block.service";
import { DatasetInfo } from "../interface/navigation.interface";
import { MaybeNull } from "../interface/app.types";
import { NavigationService } from "./navigation.service";

export abstract class BaseYamlEventService {
    private blockService = inject(BlockService);
    private navigationService = inject(NavigationService);
    public sourceNames: string[] = [];

    public getEventAsYaml(
        info: DatasetInfo,
        eventTypes: [MetadataEventType],
        sourceName: MaybeNull<string> = null,
    ): Observable<MaybeNull<string>> {
        return this.blockService
            .requestBlocksByEventType({ ...info, eventTypes, encoding: MetadataManifestFormat.Yaml })
            .pipe(
                map((blocks: MetadataBlockExtended[]) => {
                    if (eventTypes[0] === MetadataEventType.AddPushSource) {
                        this.sourceNames = blocks.map((item) => (item.event as AddPushSource).sourceName);
                        if (sourceName) {
                            if (!this.sourceNames.includes(sourceName)) {
                                this.navigationService.navigateToPageNotFound();
                            }
                            const block = blocks.filter(
                                (item) =>
                                    item.event.__typename === "AddPushSource" && item.event.sourceName === sourceName,
                            )[0];
                            return block.encoded as string;
                        } else {
                            return null;
                        }
                    } else {
                        return blocks.length ? (blocks[0].encoded as string) : null;
                    }
                }),
            );
    }
}
