/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QueryExplainerComponent } from "./query-explainer.component";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { HighlightModule } from "ngx-highlightjs";
import { VerifyResultSectionComponent } from "./components/verify-result-section/verify-result-section.component";
import { ReproducedResultSectionComponent } from "./components/reproduced-result-section/reproduced-result-section.component";
import { InputDataSectionComponent } from "./components/input-data-section/input-data-section.component";
import { CommitmentDataSectionComponent } from "./components/commitment-data-section/commitment-data-section.component";
import { DisplayHashModule } from "src/app/common/components/display-hash/display-hash.module";
import { DynamicTableModule } from "../common/components/dynamic-table/dynamic-table.module";
import { FormsModule } from "@angular/forms";
import { MarkdownModule } from "ngx-markdown";
import { CopyToClipboardModule } from "../common/components/copy-to-clipboard/copy-to-clipboard.module";

@NgModule({
    declarations: [
        CommitmentDataSectionComponent,
        InputDataSectionComponent,
        QueryExplainerComponent,
        ReproducedResultSectionComponent,
        VerifyResultSectionComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HighlightModule,
        MatIconModule,
        MarkdownModule,
        RouterModule,

        CopyToClipboardModule,
        DisplayHashModule,
        DynamicTableModule,
    ],
})
export class QueryExplainerModule {}
