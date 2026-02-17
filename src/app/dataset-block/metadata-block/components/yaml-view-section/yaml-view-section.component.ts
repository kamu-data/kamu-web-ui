/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { MarkdownFormatPipe } from "@common/pipes/markdown-format.pipe";
import { MarkdownModule } from "ngx-markdown";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MarkdownModule,
        //-----//
        MarkdownFormatPipe,
    ],
})
export class YamlViewSectionComponent {
    @Input({ required: true }) public blockAsYaml: string;
    @Input({ required: true }) public block: MetadataBlockFragment;
}
