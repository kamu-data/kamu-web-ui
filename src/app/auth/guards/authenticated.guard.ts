import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticatedGuard implements CanActivate {
    constructor(private navigationService: NavigationService, private logggedUserService: LoggedUserService) {}

    public canActivate(): boolean {
        if (!this.logggedUserService.isAuthenticated) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }
}
