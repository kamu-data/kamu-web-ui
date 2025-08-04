/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { MarkdownModule } from "ngx-markdown";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        MarkdownModule,
    ],
})
export class YamlViewSectionComponent {
    @Input({ required: true }) public blockAsYaml: string;
    @Input({ required: true }) public block: MetadataBlockFragment;

    public yamlWrapper(yaml: string): string {
        return "```yaml\n" + yaml + "\n```";
    }
}
