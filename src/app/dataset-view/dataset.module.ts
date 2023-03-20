import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { DisplayHashModule } from "src/app/components/display-hash/dispaly-hash.module";
import { DisplayTimeModule } from "./../components/display-time/display-time.module";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetComponent } from "./dataset.component";
import { SearchAdditionalButtonsModule } from "../components/search-additional-buttons/search-additional-buttons.module";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";
import { SearchSidenavModule } from "../components/search-sidenav/search-sidenav.module";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { LineageGraphModule } from "../components/lineage-graph/lineage-graph.module";
import { PaginationModule } from "../components/pagination-component/pagination.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MarkdownModule } from "ngx-markdown";
import { MatChipsModule } from "@angular/material/chips";
import { MetadataComponent } from "./additional-components/metadata-component/metadata-component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatTabsModule } from "@angular/material/tabs";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { DataComponent } from "./additional-components/data-component/data-component";
import { OverviewComponent } from "./additional-components/overview-component/overview-component";
import { LineageComponent as LineageComponent } from "./additional-components/lineage-component/lineage-component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { HistoryComponent } from "./additional-components/history-component/history-component";
import { TimelineModule } from "../components/timeline-component/timeline.module";
import { CustomPaginationModule } from "../components/custom-pagination-component/custom-pagination.module";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header-component";
import { DatasetViewMenuComponent } from "./dataset-view-menu/dataset-view-menu-component";
import { SideNavModule } from "../sidenav/side-nav.module";
import { RouterModule } from "@angular/router";
import { OverviewHistorySummaryHeaderComponent } from "../components/overview-history-summary-header/overview-history-summary-header.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DisplaySizeModule } from "../common/pipes/display-size.module";
import { SharedModule } from "../shared/shared/shared.module";
import { EditDetailsModalComponent } from "./additional-components/overview-component/components/edit-details-modal/edit-details-modal.component";
import { EditLicenseModalComponent } from "./additional-components/overview-component/components/edit-license-modal/edit-license-modal.component";
import { FinalYamlModalComponent } from "./additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import { FetchStepComponent } from "./additional-components/metadata-component/components/add-polling-source/steps/fetch-step/fetch-step.component";
import { ReadStepComponent } from "./additional-components/metadata-component/components/add-polling-source/steps/read-step/read-step.component";
import { MergeStepComponent } from "./additional-components/metadata-component/components/add-polling-source/steps/merge-step/merge-step.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        FormsModule,
        RouterModule,
        NgbNavModule,
        MatButtonToggleModule,
        DynamicTableModule,
        SearchSidenavModule,
        SearchAdditionalButtonsModule,
        TimelineModule,
        NgxGraphModule,
        LineageGraphModule,
        PaginationModule,
        MatMenuModule,
        MatButtonModule,
        MarkdownModule,
        MatChipsModule,
        ClipboardModule,
        MatTabsModule,
        MonacoEditorModule,
        CdkAccordionModule,
        CustomPaginationModule,
        SideNavModule,
        AngularSvgIconModule,
        DisplayTimeModule,
        DisplayHashModule,
        DisplaySizeModule,
        MatDividerModule,
        MatFormFieldModule,
        SharedModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
    exports: [
        DatasetViewHeaderComponent,
        OverviewHistorySummaryHeaderComponent,
        DatasetComponent,
        DatasetViewMenuComponent,
        MetadataComponent,
        DataComponent,
        FetchStepComponent,
        ReadStepComponent,
        MergeStepComponent,
        OverviewComponent,
        LineageComponent,
        HistoryComponent,
        MonacoEditorModule,
        DisplayHashModule,
    ],
    declarations: [
        DatasetViewHeaderComponent,
        OverviewHistorySummaryHeaderComponent,
        DatasetComponent,
        DatasetViewMenuComponent,
        MetadataComponent,
        DataComponent,
        OverviewComponent,
        LineageComponent,
        HistoryComponent,
        EditDetailsModalComponent,
        EditLicenseModalComponent,
        FinalYamlModalComponent,
        FetchStepComponent,
        ReadStepComponent,
        MergeStepComponent,
    ],
})
export class DatasetModule {
    public static forRoot(): ModuleWithProviders<DatasetModule> {
        return { ngModule: DatasetModule };
    }
}
