/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RequestTimerComponent } from "src/app/query/shared/request-timer/request-timer.component";
import { LoadMoreComponent } from "src/app/query/shared/load-more/load-more.component";
import { QueryAndResultSectionsComponent } from "src/app/query/shared/query-and-result-sections/query-and-result-sections.component";
import { SavedQueriesSectionComponent } from "src/app/query/shared/saved-queries-section/saved-queries-section.component";
import { SearchAndSchemasSectionComponent } from "../global-query/search-and-schemas-section/search-and-schemas-section.component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";

import { EditorModule } from "src/app/editor/editor.module";
import { EngineSelectComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";

@NgModule({
    imports: [
    CdkAccordionModule,
    CommonModule,
    FormsModule,
    EditorModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatProgressBarModule,
    NgbTypeaheadModule,
    QueryAndResultSectionsComponent,
    LoadMoreComponent,
    RequestTimerComponent,
    SearchAndSchemasSectionComponent,
    SavedQueriesSectionComponent,
    EngineSelectComponent,
],
    exports: [
        QueryAndResultSectionsComponent,
        SavedQueriesSectionComponent,
        SearchAndSchemasSectionComponent,
        EngineSelectComponent,
    ],
})
export class QuerySharedModule {}
