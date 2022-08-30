import { SpinnerService } from "./../spinner.service";
import { Component } from "@angular/core";

@Component({
    selector: "app-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.sass"],
})
export class SpinnerComponent {
    constructor(private spinnerService: SpinnerService) {}
    isLoading$ = this.spinnerService.isLoading$;
}
