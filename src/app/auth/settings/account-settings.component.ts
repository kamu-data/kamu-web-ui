import ProjectLinks from "src/app/project-links";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountSettingsTabs } from "./account-settings.constants";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { BaseComponent } from "src/app/common/base.component";
import AppValues from "src/app/common/app.values";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { combineLatest, Observable } from "rxjs";
import { LoggedUserService } from "../logged-user.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
    selector: "app-settings",
    templateUrl: "./account-settings.component.html",
    styleUrls: ["./account-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent extends BaseComponent implements OnInit {
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly AccountSettingsTabs: typeof AccountSettingsTabs = AccountSettingsTabs;

    public activeTab: AccountSettingsTabs = AccountSettingsTabs.PROFILE;
    public user$: Observable<MaybeNull<AccountFragment>>;
    public adminPrivileges$: Observable<boolean>;

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private loggedUserService = inject(LoggedUserService);
    private localStorageService = inject(LocalStorageService);

    public userData$: Observable<{
        user: AccountFragment;
        adminPrivileges: boolean;
    } | null>;

    public ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this.extractActiveTabFromRoute();
            });

        this.extractActiveTabFromRoute();

        this.userData$ = combineLatest([
            this.loggedUserService.loggedInUserChanges,
            this.loggedUserService.adminPrivilegesChanges,
        ]).pipe(
            map(([user, adminPrivileges]) => {
                return user
                    ? {
                          user,
                          adminPrivileges,
                      }
                    : null;
            }),
        );
    }

    public getRouteLink(tab: AccountSettingsTabs): string {
        return `/${ProjectLinks.URL_SETTINGS}/${tab}`;
    }

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public adminSlideToggleChange(event: MatSlideToggleChange): void {
        this.loggedUserService.emitAdminPrivilegesChanges(event.checked);
        this.localStorageService.setAdminPriveleges(event.checked);
    }

    private extractActiveTabFromRoute(): void {
        const categoryParam: MaybeUndefined<string> = this.route.snapshot.params[
            ProjectLinks.URL_PARAM_CATEGORY
        ] as MaybeUndefined<string>;

        if (categoryParam) {
            const category = categoryParam as AccountSettingsTabs;
            if (Object.values(AccountSettingsTabs).includes(category)) {
                this.activeTab = category;
                return;
            }
        }

        this.activeTab = AccountSettingsTabs.PROFILE;
    }
}
