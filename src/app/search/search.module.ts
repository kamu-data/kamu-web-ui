import { DisplayTimeModule } from "../components/display-time/display-time.module";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchComponent } from "./search.component";
import { SearchAdditionalButtonsModule } from "../components/search-additional-buttons/search-additional-buttons.module";
import { FormsModule } from "@angular/forms";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";
import { MatChipsModule } from "@angular/material/chips";
import { DatasetListModule } from "../components/dataset-list-component/dataset-list.module";
import { PaginationModule } from "../components/pagination-component/pagination.module";
import { ModalModule } from "../components/modal/modal.module";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
    imports: [
        CommonModule,
        SearchAdditionalButtonsModule,
        FormsModule,
        DynamicTableModule,
        PaginationModule,
        MatChipsModule,
        DatasetListModule,
        ModalModule,
        MatCheckboxModule,
        DisplayTimeModule,
    ],
    exports: [SearchComponent],
    declarations: [SearchComponent],
})
export class SearchModule {
    public static forRoot(): ModuleWithProviders<SearchModule> {
        return { ngModule: SearchModule };
    }
}
