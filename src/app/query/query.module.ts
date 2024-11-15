import { MatButtonToggleModule } from "@angular/material/button-toggle";
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
import { QueryAndResultSectionsComponent } from "../dataset-view/additional-components/data-component/query-and-result-sections/query-and-result-sections.component";
import { LoadMoreComponent } from "../dataset-view/additional-components/data-component/load-more/load-more.component";
import { RequestTimerComponent } from "../dataset-view/additional-components/data-component/request-timer/request-timer.component";
import { MatIconModule } from "@angular/material/icon";
import { SavedQueriesSectionComponent } from "../dataset-view/additional-components/data-component/saved-queries-section/saved-queries-section.component";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [
        GlobalQueryComponent,
        RequestTimerComponent,
        LoadMoreComponent,
        SearchAndSchemasSectionComponent,
        QueryAndResultSectionsComponent,
        SavedQueriesSectionComponent,
    ],
    imports: [
        CommonModule,
        MatProgressBarModule,
        DynamicTableModule,
        EditorModule,
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        FormsModule,
        NgbTypeaheadModule,
        CdkAccordionModule,
        MatButtonModule,
        MatButtonToggleModule,
    ],
    exports: [QueryAndResultSectionsComponent, SavedQueriesSectionComponent],
})
export class QueryModule {}
