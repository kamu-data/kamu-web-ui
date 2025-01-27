import { SpinnerService } from "../spinner.service";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

@Component({
    selector: "app-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
    private spinnerService = inject(SpinnerService);
    public isLoading$ = this.spinnerService.isLoadingChanges;
}
