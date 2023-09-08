import { SpinnerService } from "../spinner.service";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
    constructor(private spinnerService: SpinnerService) {}
    isLoading$ = this.spinnerService.isLoading;
}
