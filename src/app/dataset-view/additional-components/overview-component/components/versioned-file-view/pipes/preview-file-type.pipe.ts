/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "previewFileType",
})
export class PreviewFileTypePipe implements PipeTransform {
    public transform(contentType: string): "pdf" | "image" | "json" | "text" | "video" | "unknown" {
        if (!contentType) return "unknown";
        if (contentType === "application/pdf") return "pdf";
        if (contentType.startsWith("image/")) return "image";
        if (contentType.startsWith("video/")) return "video";
        if (contentType.includes("json")) return "json";
        if (contentType === "text/plain" || contentType === "application/octet-stream") return "text";

        return "unknown";
    }
}
