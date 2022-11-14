import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthApi } from "../api/auth.api";

@Injectable({
    providedIn: "root",
})
export class AuthenticationGuard implements CanActivate {
    constructor(
        private navigationService: NavigationService,
        private authApi: AuthApi,
    ) {}
    canActivate(): boolean {
        if (!this.authApi.isAuthenticated) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }
}
