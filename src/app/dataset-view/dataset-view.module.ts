import { EventDetailsPropertiesModule } from "../dataset-block/metadata-block/components/event-details/components/common/event-details-properties.module";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { DisplayHashModule } from "src/app/common/components/display-hash/display-hash.module";
import { DisplayTimeModule } from "../common/components/display-time/display-time.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetViewComponent } from "./dataset-view.component";
import { SearchAdditionalButtonsModule } from "../common/components/search-additional-buttons/search-additional-buttons.module";
import { NgbModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicTableModule } from "../common/components/dynamic-table/dynamic-table.module";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { LineageGraphModule } from "../common/components/lineage-graph/lineage-graph.module";
import { PaginationModule } from "../common/components/pagination-component/pagination.module";
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
import { TimelineModule } from "../common/components/timeline-component/timeline.module";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header.component";
import { RouterModule } from "@angular/router";
import { OverviewHistorySummaryHeaderComponent } from "./additional-components/overview-component/components/overview-history-summary-header/overview-history-summary-header.component";
import { DisplaySizeModule } from "../common/pipes/display-size.module";
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
import { AddPollingSourceComponent } from "./additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source.component";
import { MatStepperModule } from "@angular/material/stepper";
import { EngineSelectComponent } from "./additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";
import { ReadmeSectionComponent } from "./additional-components/overview-component/components/readme-section/readme-section.component";
import { DatasetSettingsComponent } from "./additional-components/dataset-settings-component/dataset-settings.component";
import { MatInputModule } from "@angular/material/input";
import { EditorModule } from "../editor/editor.module";
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
import { DataAccessPanelModule } from "../data-access-panel/data-access-panel.module";
import { DatasetSettingsSecretsManagerTabComponent } from "./additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-settings-secrets-manager-tab.component";
import { MatSortModule } from "@angular/material/sort";
import { EditKeyValueModalComponent } from "./additional-components/dataset-settings-component/tabs/variables-and-secrets/components/edit-key-value-modal/edit-key-value-modal.component";
import { DatasetSettingsCompactingTabComponent } from "./additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.component";
import { AddDataModalComponent } from "./additional-components/overview-component/components/add-data-modal/add-data-modal.component";
import { FileFromUrlModalComponent } from "./additional-components/overview-component/components/file-from-url-modal/file-from-url-modal.component";
import { FlowsComponent } from "./additional-components/flows-component/flows.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";
import { DatasetVisibilityModule } from "../common/components/dataset-visibility/dataset-visibility.module";
import { QuerySharedModule } from "../query/shared/query-shared.module";
import { IngestConfigurationModule } from "./additional-components/dataset-settings-component/tabs/scheduling/ingest-configuration-form/ingest-configuration.module";
import { IngestTriggerModule } from "./additional-components/dataset-settings-component/tabs/scheduling/ingest-trigger-form/ingest-trigger.module";
import { BatchingTriggerModule } from "./additional-components/dataset-settings-component/tabs/scheduling/batching-trigger-form/batching-trigger.module";
import { FlowsViewModule } from "../dataset-flow/flows-view.module";
import { DatasetViewMenuModule } from "./dataset-view-menu/dataset-view-menu.module";
import { DragAndDropModule } from "../common/directives/drag-and-drop.module";
import { BlockRowDataModule } from "../common/components/block-row-data/block-row-data.module";
import { TooltipIconModule } from "../common/components/tooltip-icon/tooltip-icon.module";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";
import { YamlEventViewerModule } from "../common/components/yaml-event-viewer/yaml-event-viewer.module";
import { CommitNavigatorModule } from "./additional-components/metadata-component/components/commit-navigator/commit-navigator.module";
import { DatasetSettingsTransformOptionsTabComponent } from "./additional-components/dataset-settings-component/tabs/transform-options/dataset-settings-transform-options-tab.component";
import { DatasetSettingsAccessTabComponent } from "./additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-settings-access-tab.component";
@NgModule({
    imports: [
        DynamicTableModule,
        CommonModule,
        ClipboardModule,
        CdkAccordionModule,
        FormsModule,
        FormsModule,
        LineageGraphModule,
        MarkdownModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatMenuModule,
        MatIconModule,
        MatTabsModule,
        MatTreeModule,
        MatStepperModule,
        MatInputModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDividerModule,
        MatSortModule,
        NgbModule,
        NgbNavModule,
        NgxGraphModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,
        OwlNativeDateTimeModule,
        ReactiveFormsModule,
        RouterModule,

        BatchingTriggerModule,
        BlockRowDataModule,
        CommitNavigatorModule,
        DatasetViewMenuModule,
        DataAccessPanelModule,
        DatasetVisibilityModule,
        DisplayTimeModule,
        DisplayHashModule,
        DisplaySizeModule,
        DragAndDropModule,
        EditorModule,
        EventDetailsPropertiesModule,
        FeatureFlagModule,
        FlowsViewModule,
        IngestConfigurationModule,
        IngestTriggerModule,
        QuerySharedModule,
        PaginationModule,
        PollingSourceFormComponentsModule,
        SearchAdditionalButtonsModule,
        TimelineModule,
        TooltipIconModule,
        YamlEventViewerModule,
    ],
    exports: [
        BaseStepComponent,
        DataComponent,
        DatasetViewHeaderComponent,
        DatasetViewComponent,
        HistoryComponent,
        LineageComponent,
        MetadataComponent,
        OverviewHistorySummaryHeaderComponent,
        OverviewComponent,
        PrepareStepComponent,
        PreprocessStepComponent,
        StepperNavigationComponent,
    ],
    declarations: [
        AddDataModalComponent,
        AddPollingSourceComponent,
        AddPushSourceComponent,
        BaseStepComponent,
        DataComponent,
        DatasetSettingsComponent,
        DatasetSettingsAccessTabComponent,
        DatasetSettingsCompactingTabComponent,
        DatasetSettingsGeneralTabComponent,
        DatasetSettingsSchedulingTabComponent,
        DatasetSettingsSecretsManagerTabComponent,
        DatasetSettingsTransformOptionsTabComponent,
        DatasetViewHeaderComponent,
        DatasetViewComponent,
        EditDetailsModalComponent,
        EditKeyValueModalComponent,
        EditLicenseModalComponent,
        EditWatermarkModalComponent,
        EngineSectionComponent,
        EngineSelectComponent,
        FileFromUrlModalComponent,
        FinalYamlModalComponent,
        FlowsComponent,
        HistoryComponent,
        LineageComponent,
        MetadataComponent,
        OverviewComponent,
        OverviewHistorySummaryHeaderComponent,
        PrepareStepComponent,
        PreprocessStepComponent,
        ReadmeSectionComponent,
        StepperNavigationComponent,
        SetTransformComponent,
        SearchSectionComponent,
        SourceNameStepComponent,
        QueriesSectionComponent,
    ],
})
export class DatasetViewModule {}
