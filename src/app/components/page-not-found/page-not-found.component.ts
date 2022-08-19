import { NavigationService } from "src/app/services/navigation.service";
import { Component } from "@angular/core";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.sass"],
})
export class PageNotFoundComponent {
    public appLogo = `/${AppValues.appLogo}`;

    constructor(private navigationService: NavigationService) {}

    public navigateToNome(): void {
        this.navigationService.navigateToHome();
    }
}
