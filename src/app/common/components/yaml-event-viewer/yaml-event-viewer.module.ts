/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { YamlEventViewerComponent } from "./yaml-event-viewer.component";
import { HighlightModule } from "ngx-highlightjs";

@NgModule({
    declarations: [YamlEventViewerComponent],
    exports: [YamlEventViewerComponent],
    imports: [CommonModule, HighlightModule],
})
export class YamlEventViewerModule {}
