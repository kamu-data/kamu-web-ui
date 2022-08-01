import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {AccountComponent} from "./account.component";
import {RepoListModule} from "../../components/repo-list-component/repo-list.module";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FormsModule,
        RepoListModule,
        MatIconModule,
    ],
    exports: [
        AccountComponent
    ],
    declarations: [
        AccountComponent
    ],
})
export class AccountModule {
    public static forRoot(): ModuleWithProviders<AccountModule> {
        return { ngModule: AccountModule };
    }
}
