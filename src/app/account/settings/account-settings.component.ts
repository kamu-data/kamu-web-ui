import ProjectLinks from "src/app/project-links";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { AccountSettingsTabs } from "./account-settings.constants";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, switchMap } from "rxjs/operators";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { EMPTY, Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { LoggedUserService } from "../../auth/logged-user.service";

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
    public user$: Observable<MaybeNull<AccountWithEmailFragment>>;

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private accountEmailService = inject(AccountEmailService);
    private loggedUserService = inject(LoggedUserService);
    private cdr = inject(ChangeDetectorRef);

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
        this.fetchAccountInfo();
    }

    public getRouteLink(tab: AccountSettingsTabs): string {
        return `/${ProjectLinks.URL_SETTINGS}/${tab}`;
    }

    private fetchAccountInfo(): void {
        this.user$ = this.loggedUserService.loggedInUserChanges.pipe(
            switchMap((loggedUser) => {
                if (loggedUser) {
                    return this.accountEmailService.fetchAccountWithEmail(loggedUser.accountName);
                } else {
                    return EMPTY;
                }
            }),
        );
    }

    public changeAccountEmail(): void {
        this.fetchAccountInfo();
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
