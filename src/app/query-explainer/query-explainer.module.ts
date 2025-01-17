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
import { DisplayHashModule } from "../components/display-hash/display-hash.module";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";
import { FormsModule } from "@angular/forms";
import { AutofocusModule } from "../common/directives/autofocus.module";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
    declarations: [
        QueryExplainerComponent,
        VerifyResultSectionComponent,
        ReproducedResultSectionComponent,
        InputDataSectionComponent,
        CommitmentDataSectionComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        DisplayHashModule,
        RouterModule,
        HighlightModule,
        DynamicTableModule,
        FormsModule,
        AutofocusModule,
        MarkdownModule,
    ],
})
export class QueryExplainerModule {}
