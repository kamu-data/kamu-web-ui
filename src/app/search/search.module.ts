import { DisplayTimeModule } from "../common/components/display-time/display-time.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchComponent } from "./search.component";
import { SearchAdditionalButtonsModule } from "../common/components/search-additional-buttons/search-additional-buttons.module";
import { FormsModule } from "@angular/forms";
import { DynamicTableModule } from "../common/components/dynamic-table/dynamic-table.module";
import { MatChipsModule } from "@angular/material/chips";
import { DatasetListModule } from "../common/components/dataset-list-component/dataset-list.module";
import { PaginationModule } from "../common/components/pagination-component/pagination.module";
import { ModalModule } from "../common/components/modal/modal.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";

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
        FeatureFlagModule,
    ],
    exports: [SearchComponent],
    declarations: [SearchComponent],
})
export class SearchModule {}
