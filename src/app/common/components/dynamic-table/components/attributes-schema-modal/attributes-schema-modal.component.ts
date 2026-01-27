/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { MarkdownFormatPipe } from "src/app/common/pipes/markdown-format.pipe";
import * as YAML from "yaml";
import { DataSchemaField } from "src/app/interface/dataset.interface";

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
    @Input({ required: true }) public element: DataSchemaField;

    public convertToYaml(value: DataSchemaField): string {
        return YAML.stringify(value);
    }
}
