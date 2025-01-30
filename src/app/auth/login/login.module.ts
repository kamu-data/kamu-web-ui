import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { SpinnerModule } from "src/app/common/components/spinner/spinner.module";

@NgModule({
    declarations: [LoginComponent],
    exports: [LoginComponent],
    imports: [CommonModule, MatIconModule, ReactiveFormsModule, SpinnerModule],
})
export class LoginModule {}
