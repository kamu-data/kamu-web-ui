import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { SpinnerModule } from "src/app/common/components/spinner/spinner.module";
import { GithubCallbackComponent } from "../github-callback/github.callback";

@NgModule({
    declarations: [LoginComponent, GithubCallbackComponent],
    exports: [LoginComponent, GithubCallbackComponent],
    imports: [CommonModule, MatIconModule, ReactiveFormsModule, SpinnerModule],
})
export class LoginModule {}
