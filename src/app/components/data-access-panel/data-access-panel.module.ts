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
import { DataAccessModalComponent } from "./data-access-modal/data-access-modal.component";
import { DataAccessLinkTabComponent } from "./data-access-modal/tabs/data-access-link-tab/data-access-link-tab.component";
import { DataAccessKamuCliTabComponent } from "./data-access-modal/tabs/data-access-kamu-cli-tab/data-access-kamu-cli-tab.component";
import { DataAccessRestTabComponent } from "./data-access-modal/tabs/data-access-rest-tab/data-access-rest-tab.component";
import { DataAccessSqlTabComponent } from "./data-access-modal/tabs/data-access-sql-tab/data-access-sql-tab.component";
import { DataAccessStreamTabComponent } from "./data-access-modal/tabs/data-access-stream-tab/data-access-stream-tab.component";
import { DataAccessCodeTabComponent } from "./data-access-modal/tabs/data-access-code-tab/data-access-code-tab.component";
import { DataAccessOdataTabComponent } from "./data-access-modal/tabs/data-access-odata-tab/data-access-odata-tab.component";
import { DataAccessExportTabComponent } from "./data-access-modal/tabs/data-access-export-tab/data-access-export-tab.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared/shared.module";

@NgModule({
    declarations: [
        DataAccessPanelComponent,
        DataAccessModalComponent,
        DataAccessLinkTabComponent,
        DataAccessKamuCliTabComponent,
        DataAccessRestTabComponent,
        DataAccessSqlTabComponent,
        DataAccessStreamTabComponent,
        DataAccessCodeTabComponent,
        DataAccessOdataTabComponent,
        DataAccessExportTabComponent,
    ],
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
        RouterModule,
        SharedModule,
    ],
    exports: [DataAccessPanelComponent],
})
export class DataAccessPanelModule {}
