import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataAccessPanelComponent } from "./data-access-panel.component";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
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
