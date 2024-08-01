import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataAccessPanelComponent } from "./data-access-panel.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ClipboardModule } from "@angular/cdk/clipboard";

@NgModule({
    declarations: [DataAccessPanelComponent],
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        FormsModule,
        AngularSvgIconModule,
        MatCheckboxModule,
        MatDividerModule,
        MatTooltipModule,
        ClipboardModule,
        ReactiveFormsModule,
    ],
    exports: [DataAccessPanelComponent],
})
export class DataAccessPanelModule {}
