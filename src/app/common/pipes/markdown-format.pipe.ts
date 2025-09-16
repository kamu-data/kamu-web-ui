/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

export type MarkdownSupportedFormats = "yaml" | "sql" | "json";

@Pipe({
    name: "markdownFormat",
    standalone: true,
})
export class MarkdownFormatPipe implements PipeTransform {
    public transform(value: string | object, format: MarkdownSupportedFormats): string {
        switch (format) {
            case "yaml":
                return "```yaml\n" + (value as string) + "\n```";
            case "sql":
                return "```sql\n" + (value as string) + "\n```";
            case "json":
                return "```json\n" + JSON.stringify(value, null, 2) + "\n```";
            /* istanbul ignore next */
            default:
                return value as string;
        }
    }
}
