import { NavigationService } from "src/app/services/navigation.service";
import { inject, Injectable } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticatedGuard {
    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);

    public canActivate(): boolean {
        if (!this.loggedUserService.isAuthenticated) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }
}
