import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountSettingsComponent } from "./account-settings.component";
import { EmailsTabComponent } from "./tabs/emails-tab/emails-tab.component";
import { AccessTokensTabComponent } from "./tabs/access-tokens-tab/access-tokens-tab.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { PaginationModule } from "src/app/common/components/pagination-component/pagination.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";

@NgModule({
    declarations: [AccessTokensTabComponent, AccountSettingsComponent, EmailsTabComponent],
    exports: [AccountSettingsComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDividerModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTableModule,
        ReactiveFormsModule,
        RouterModule,

        FeatureFlagModule,
        PaginationModule,
    ],
})
export class AccountSettingsModule {}
