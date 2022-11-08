import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthApi } from "../api/auth.api";

@Injectable({
    providedIn: "root",
})
export class AuthentificationGuard implements CanActivate {
    constructor(
        private navigationService: NavigationService,
        private authApi: AuthApi,
    ) {}
    canActivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (!this.authApi.isAuthenticated) {
            this.navigationService.navigateToHome();
            return false;
        }
        return true;
    }
}
