import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QueryExplainerComponent } from "./query-explainer.component";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DisplayHashModule } from "../display-hash/display-hash.module";
import { RouterModule } from "@angular/router";
import { HighlightModule } from "ngx-highlightjs";
import { DynamicTableModule } from "../dynamic-table/dynamic-table.module";
import { VerifyResultSectionComponent } from './components/verify-result-section/verify-result-section.component';
import { ReproducedResultSectionComponent } from './components/reproduced-result-section/reproduced-result-section.component';

@NgModule({
    declarations: [QueryExplainerComponent, VerifyResultSectionComponent, ReproducedResultSectionComponent],
    imports: [
        CommonModule,
        MatIconModule,
        AngularSvgIconModule.forRoot(),
        DisplayHashModule,
        RouterModule,
        HighlightModule,
        DynamicTableModule,
    ],
})
export class QueryExplainerModule {}
