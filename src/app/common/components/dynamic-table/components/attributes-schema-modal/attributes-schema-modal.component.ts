/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { MarkdownFormatPipe } from "@common/pipes/markdown-format.pipe";
import { MarkdownModule } from "ngx-markdown";
import * as YAML from "yaml";

@Component({
    selector: "app-attributes-schema-modal",
    standalone: true,
    imports: [
        //-----//
        MarkdownModule,

        //-----//
        MarkdownFormatPipe,
    ],
    templateUrl: "./attributes-schema-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributesSchemaModalComponent {
    @Input({ required: true }) public element: unknown;

    public convertToYaml(value: unknown): string {
        return YAML.stringify(value);
    }
}
