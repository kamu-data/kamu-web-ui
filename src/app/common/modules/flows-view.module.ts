import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlowsTableComponent } from "../components/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "../components/tile-base-widget/tile-base-widget.component";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDividerModule } from "@angular/material/divider";
import { RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";

@NgModule({
    declarations: [FlowsTableComponent, TileBaseWidgetComponent],
    exports: [FlowsTableComponent, TileBaseWidgetComponent],
    imports: [
        CommonModule,
        NgbPopoverModule,
        MatDividerModule,
        RouterModule,
        MatMenuModule,
        MatIconModule,
        SharedModule,
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        AngularMultiSelectModule,
    ],
})
export class FlowsViewModule {}
