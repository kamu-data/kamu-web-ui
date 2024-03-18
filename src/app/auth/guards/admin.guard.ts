import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { LoggedUserService } from "../logged-user.service";

@Injectable({
    providedIn: "root",
})
export class AdminGuard implements CanActivate {
    constructor(
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
    ) {}

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
