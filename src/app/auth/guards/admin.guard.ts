import { inject, Injectable } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { LoggedUserService } from "../logged-user.service";

@Injectable({
    providedIn: "root",
})
export class AdminGuard {
    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);

    public canActivate(): boolean {
        if (!this.isAdmin()) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }

    private isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }
}
