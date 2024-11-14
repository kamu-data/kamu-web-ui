import { DatasetModule } from "./../dataset-view/dataset.module";
import { EditorModule } from "./../shared/editor/editor.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GlobalQueryComponent } from "./global-query/global-query.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";
import { FormsModule } from "@angular/forms";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { SearchAndSchemasSectionComponent } from "./global-query/search-and-schemas-section/search-and-schemas-section.component";

@NgModule({
    declarations: [GlobalQueryComponent, SearchAndSchemasSectionComponent],
    imports: [
        CommonModule,
        MatProgressBarModule,
        DynamicTableModule,
        EditorModule,
        MatDividerModule,
        MatMenuModule,
        DatasetModule,
        FormsModule,
        NgbTypeaheadModule,
        CdkAccordionModule,
    ],
})
export class QueryModule {}
