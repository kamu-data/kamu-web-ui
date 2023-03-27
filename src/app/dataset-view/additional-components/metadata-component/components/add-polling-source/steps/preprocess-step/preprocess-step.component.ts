import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-preprocess-step",
    templateUrl: "./preprocess-step.component.html",
    styleUrls: ["./preprocess-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprocessStepComponent {}
