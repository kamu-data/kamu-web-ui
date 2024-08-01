import { SpinnerComponent } from "./spinner/spinner.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
    declarations: [SpinnerComponent],
    imports: [CommonModule, MatProgressBarModule],
    exports: [SpinnerComponent],
})
export class SpinnerModule {}
