import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TileBaseWidgetComponent } from "src/app/common/components/tile-base-widget/tile-base-widget.component";
import { FlowsTableComponent } from "src/app/common/components/flows-table/flows-table.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { FormsModule } from "@angular/forms";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [TileBaseWidgetComponent, FlowsTableComponent],
    imports: [
        CommonModule,
        MatDividerModule,
        MatMenuModule,
        NgbPopoverModule,
        RouterModule,
        AngularSvgIconModule,
        MatIconModule,
        SharedModule,
        MatTableModule,
        FormsModule,
        AngularMultiSelectModule,
        MatButtonModule,
    ],
    exports: [TileBaseWidgetComponent, FlowsTableComponent],
})
export class DatasetFlowModule {}
