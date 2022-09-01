import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SpinnerComponent } from "./spinner/spinner.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [SpinnerComponent],
    imports: [CommonModule, MatProgressSpinnerModule],
    exports: [SpinnerComponent],
})
export class SpinnerModule {}
