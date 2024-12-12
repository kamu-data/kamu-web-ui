import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

import { AngularSvgIconModule } from "angular-svg-icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MarkdownModule } from "ngx-markdown";
import { OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";

import { OverviewComponent } from "./components/overview-component/overview.component";
import { OverviewTabRoutingModule } from "./overview-tab-routing.module";
import { AddDataModalComponent } from "./components/add-data-modal/add-data-modal.component";
import { EditDetailsModalComponent } from "./components/edit-details-modal/edit-details-modal.component";
import { EditLicenseModalComponent } from "./components/edit-license-modal/edit-license-modal.component";
import { EditWatermarkModalComponent } from "./components/edit-watermark-modal/edit-watermark-modal.component";
import { FileFromUrlModalComponent } from "./components/file-from-url-modal/file-from-url-modal.component";
import { ReadmeSectionComponent } from "./components/readme-section/readme-section.component";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
import { DynamicTableModule } from "src/app/components/dynamic-table/dynamic-table.module";
import { OverviewHistorySummaryHeaderComponent } from "src/app/components/overview-history-summary-header/overview-history-summary-header.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { SharedModule } from "src/app/shared/shared/shared.module";

@NgModule({
    declarations: [
        OverviewComponent,
        OverviewHistorySummaryHeaderComponent,
        EditDetailsModalComponent,
        EditLicenseModalComponent,
        EditWatermarkModalComponent,
        ReadmeSectionComponent,
        AddDataModalComponent,
        FileFromUrlModalComponent,
    ],
    imports: [
        CommonModule, 
        AngularSvgIconModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MarkdownModule,
        OwlDateTimeModule,
        DisplayHashModule,
        DisplayTimeModule, 
        DisplaySizeModule,
        DynamicTableModule,
        SharedModule,
        OverviewTabRoutingModule, 
    ],
})
export class OverviewTabModule {}
