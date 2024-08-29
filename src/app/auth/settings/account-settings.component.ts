import ProjectLinks from "src/app/project-links";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountSettingsTabs } from "./account-settings.constants";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { BaseComponent } from "src/app/common/base.component";
import AppValues from "src/app/common/app.values";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { Observable } from "rxjs";
import { LoggedUserService } from "../logged-user.service";

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

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.trackSubscription(
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                this.extractActiveTabFromRoute();
            }),
        );
        this.extractActiveTabFromRoute();
        this.user$ = this.loggedUserService.loggedInUserChanges;
    }

    public getRouteLink(tab: AccountSettingsTabs): string {
        return `/${ProjectLinks.URL_SETTINGS}/${tab}`;
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
