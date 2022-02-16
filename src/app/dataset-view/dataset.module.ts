import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetComponent } from "./dataset.component";
import { SearchAdditionalButtonsModule } from "../components/search-additional-buttons/search-additional-buttons.module";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";
import { SearchSidenavModule } from "../components/search-sidenav/search-sidenav.module";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { LinageGraphModule } from "../components/linage-graph/linage-graph.module";
import { PaginationModule } from "../components/pagination-component/pagination.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MarkdownModule } from "ngx-markdown";
import { MatChipsModule } from "@angular/material/chips";
import { MetadataComponent } from "./additional-components/metadata-component/metadata-component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatTabsModule } from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        FormsModule,
        NgbNavModule,
        MatButtonToggleModule,
        DynamicTableModule,
        SearchSidenavModule,
        SearchAdditionalButtonsModule,
        NgxGraphModule,
        LinageGraphModule,
        PaginationModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MarkdownModule,
        MatChipsModule,
        ClipboardModule,
        MatTabsModule,
    ],
    exports: [DatasetComponent, MetadataComponent],
    declarations: [DatasetComponent, MetadataComponent],
})
export class DatasetModule {
    public static forRoot(): ModuleWithProviders<DatasetModule> {
        return { ngModule: DatasetModule };
    }
}
