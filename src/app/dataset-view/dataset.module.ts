import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
import { DisplayTimeModule } from "../components/display-time/display-time.module";
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
import { MetadataComponent } from "./additional-components/metadata-component/metadata.component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DataComponent } from "./additional-components/data-component/data.component";
import { OverviewComponent } from "./additional-components/overview-component/overview.component";
import { LineageComponent as LineageComponent } from "./additional-components/lineage-component/lineage.component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { HistoryComponent } from "./additional-components/history-component/history.component";
import { TimelineModule } from "../components/timeline-component/timeline.module";
import { CustomPaginationModule } from "../components/custom-pagination-component/custom-pagination.module";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header.component";
import { DatasetViewMenuComponent } from "./dataset-view-menu/dataset-view-menu.component";
import { SideNavModule } from "../sidenav/side-nav.module";
import { RouterModule } from "@angular/router";
import { OverviewHistorySummaryHeaderComponent } from "../components/overview-history-summary-header/overview-history-summary-header.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DisplaySizeModule } from "../common/pipes/display-size.module";
import { SharedModule } from "../shared/shared/shared.module";
import { EditDetailsModalComponent } from "./additional-components/overview-component/components/edit-details-modal/edit-details-modal.component";
import { EditLicenseModalComponent } from "./additional-components/overview-component/components/edit-license-modal/edit-license-modal.component";
import { FinalYamlModalComponent } from "./additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import { BaseStepComponent } from "./additional-components/metadata-component/components/source-events/steps/base-step/base-step.component";
import { StepperNavigationComponent } from "./additional-components/metadata-component/components/stepper-navigation/stepper-navigation.component";
import { PrepareStepComponent } from "./additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component";
import { PreprocessStepComponent } from "./additional-components/metadata-component/components/source-events/steps/preprocess-step/preprocess-step.component";
import { PollingSourceFormComponentsModule } from "./additional-components/metadata-component/components/form-components/polling-source-form-components.module";
import { EditWatermarkModalComponent } from "./additional-components/overview-component/components/edit-watermark-modal/edit-watermark-modal.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { SetTransformComponent } from "./additional-components/metadata-component/components/set-transform/set-transform.component";
import { MatTreeModule } from "@angular/material/tree";
import { SearchSectionComponent } from "./additional-components/metadata-component/components/set-transform/components/search-section/search-section.component";
import { EngineSectionComponent } from "./additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.component";
import { QueriesSectionComponent } from "./additional-components/metadata-component/components/set-transform/components/queries-section/queries-section.component";
import { PageNotFoundComponent } from "../components/page-not-found/page-not-found.component";
import { AddPollingSourceComponent } from "./additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source.component";
import { MatStepperModule } from "@angular/material/stepper";
import { EngineSelectComponent } from "./additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";
import { ReadmeSectionComponent } from "./additional-components/overview-component/components/readme-section/readme-section.component";
import { DatasetSettingsComponent } from "./additional-components/dataset-settings-component/dataset-settings.component";
import { LoadMoreComponent } from "./additional-components/data-component/load-more/load-more.component";
import { MatInputModule } from "@angular/material/input";
import { ReturnToCliComponent } from "../components/return-to-cli/return-to-cli.component";
import { EditorModule } from "../shared/editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AddPushSourceComponent } from "./additional-components/metadata-component/components/source-events/add-push-source/add-push-source.component";
import { SourceNameStepComponent } from "./additional-components/metadata-component/components/source-events/steps/source-name-step/source-name-step.component";
import { DatasetSettingsGeneralTabComponent } from "./additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.component";
import { DatasetSettingsSchedulingTabComponent } from "./additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DataAccessPanelModule } from "../components/data-access-panel/data-access-panel.module";
import { DatasetSettingsSecretsManagerTabComponent } from "./additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-settings-secrets-manager-tab.component";
import { MatSortModule } from "@angular/material/sort";
import { EditKeyValueModalComponent } from "./additional-components/dataset-settings-component/tabs/variables-and-secrets/components/edit-key-value-modal/edit-key-value-modal.component";
import { DatasetSettingsCompactingTabComponent } from "./additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.component";
import { RequestTimerComponent } from "./additional-components/data-component/request-timer/request-timer.component";
import { AddDataModalComponent } from "./additional-components/overview-component/components/add-data-modal/add-data-modal.component";
import { FileFromUrlModalComponent } from "./additional-components/overview-component/components/file-from-url-modal/file-from-url-modal.component";
import { FlowsTableComponent } from "../common/components/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "../common/components/tile-base-widget/tile-base-widget.component";
import { FlowsComponent } from "./additional-components/flows-component/flows.component";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";

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
        PollingSourceFormComponentsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        OwlMomentDateTimeModule,
        MatTreeModule,
        MatStepperModule,
        MatInputModule,
        EditorModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDividerModule,
        DataAccessPanelModule,
        MatSortModule,
        AngularMultiSelectModule,
    ],
    exports: [
        DatasetViewHeaderComponent,
        OverviewHistorySummaryHeaderComponent,
        DatasetComponent,
        DatasetViewMenuComponent,
        MetadataComponent,
        DataComponent,
        BaseStepComponent,
        PrepareStepComponent,
        PreprocessStepComponent,
        StepperNavigationComponent,
        OverviewComponent,
        LineageComponent,
        HistoryComponent,
        DisplayHashModule,
        MatTreeModule,
        MatTooltipModule,
        DataAccessPanelModule,
        SharedModule,
        TileBaseWidgetComponent,
        FlowsTableComponent,
        AngularMultiSelectModule,
        MatChipsModule,
        RequestTimerComponent,
        LoadMoreComponent,
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
        BaseStepComponent,
        PrepareStepComponent,
        PreprocessStepComponent,
        StepperNavigationComponent,
        EditWatermarkModalComponent,
        SetTransformComponent,
        SearchSectionComponent,
        EngineSectionComponent,
        QueriesSectionComponent,
        PageNotFoundComponent,
        ReturnToCliComponent,
        AddPollingSourceComponent,
        EngineSelectComponent,
        ReadmeSectionComponent,
        DatasetSettingsComponent,
        LoadMoreComponent,
        FlowsComponent,
        TileBaseWidgetComponent,
        FlowsTableComponent,
        AddPushSourceComponent,
        SourceNameStepComponent,
        DatasetSettingsGeneralTabComponent,
        DatasetSettingsSchedulingTabComponent,
        DatasetSettingsSecretsManagerTabComponent,
        EditKeyValueModalComponent,
        DatasetSettingsCompactingTabComponent,
        RequestTimerComponent,
        AddDataModalComponent,
        FileFromUrlModalComponent,
    ],
})
export class DatasetModule {
    public static forRoot(): ModuleWithProviders<DatasetModule> {
        return { ngModule: DatasetModule };
    }
}
