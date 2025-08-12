/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

export type MarkdownSupportedFormats = "yaml" | "sql";

@Pipe({
    name: "markdownFormat",
    standalone: true,
})
export class MarkdownFormatPipe implements PipeTransform {
    public transform(value: string, format: MarkdownSupportedFormats): string {
        switch (format) {
            case "yaml":
                return "```yaml\n" + value + "\n```";
            case "sql":
                return "```sql\n" + value + "\n```";
            /* istanbul ignore next */
            default:
                return value;
        }
    }
}
