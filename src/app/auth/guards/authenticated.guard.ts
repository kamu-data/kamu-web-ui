import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticatedGuard {
    constructor(
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
    ) {}

    public canActivate(): boolean {
        if (!this.loggedUserService.isAuthenticated) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }
}
