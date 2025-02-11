import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { SpinnerModule } from "src/app/common/components/spinner/spinner.module";
import { GithubCallbackComponent } from "../github-callback/github.callback";
import { ReturnToCliComponent } from "./return-to-cli/return-to-cli.component";

@NgModule({
    declarations: [GithubCallbackComponent, LoginComponent, ReturnToCliComponent],
    exports: [GithubCallbackComponent, LoginComponent, ReturnToCliComponent],
    imports: [CommonModule, MatIconModule, ReactiveFormsModule, SpinnerModule],
})
export class LoginModule {}
