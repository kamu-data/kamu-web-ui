import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccessTokensTabComponent } from "./tabs/access-tokens-tab/access-tokens-tab.component";
import { AccountSettingsComponent } from "./account-settings.component";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@NgModule({
    declarations: [AccessTokensTabComponent, AccountSettingsComponent],
    imports: [
        CommonModule,
        RouterModule,
        AngularSvgIconModule,
        MatDividerModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        PaginationModule,
        MatTableModule,
        MatSlideToggleModule,
    ],
})
export class AccountSettingsModule {}
