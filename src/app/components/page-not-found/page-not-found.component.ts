import { NavigationService } from "src/app/services/navigation.service";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page-not-found.component.html",
    styleUrls: ["./page-not-found.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    constructor(private navigationService: NavigationService) {}

    public navigateToHome(): void {
        this.navigationService.navigateToHome();
    }
}
