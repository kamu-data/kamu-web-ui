import { SpinnerComponent } from "./spinner/spinner.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyProgressBarModule as MatProgressBarModule } from "@angular/material/legacy-progress-bar";

@NgModule({
    declarations: [SpinnerComponent],
    imports: [CommonModule, MatProgressBarModule],
    exports: [SpinnerComponent],
})
export class SpinnerModule {}
