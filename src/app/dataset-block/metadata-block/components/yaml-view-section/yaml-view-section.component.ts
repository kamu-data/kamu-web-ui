/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { SupportedEvents } from "../event-details/supported.events";
import { Observable } from "rxjs";
import { eventsWithYamlView } from "./yaml-view-section.types";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlViewSectionComponent implements OnInit {
    private blockService = inject(BlockService);
    public yamlEventText$: Observable<string>;

    public ngOnInit(): void {
        this.yamlEventText$ = this.blockService.metadataBlockAsYamlChanges;
    }

    public get currentBlock(): MetadataBlockFragment {
        return this.blockService.currentBlock;
    }

    public get isEventWithYamlView(): boolean {
        return eventsWithYamlView.includes(this.currentBlock.event.__typename as SupportedEvents);
    }
}
