import { inject } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { LoggedUserService } from "../logged-user.service";
import { CanActivateFn } from "@angular/router";
import { combineLatest, map, of } from "rxjs";

export const adminGuard: CanActivateFn = () => {
    const navigationService = inject(NavigationService);
    const loggedUserService = inject(LoggedUserService);

    return combineLatest([of(loggedUserService.isAdmin), loggedUserService.adminPrivilegesChanges]).pipe(
        map(([isAdmin, adminPrivileges]) => {
            if (isAdmin && adminPrivileges.value) {
                return true;
            } else {
                navigationService.navigateToHome();
                return false;
            }
        }),
    );
};
