import ProjectLinks from "src/app/project-links";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { AccountSettingsTabs } from "./account-settings.constants";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { switchMap } from "rxjs/operators";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { MaybeNull } from "src/app/interface/app.types";
import { EMPTY, Observable } from "rxjs";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { LoggedUserService } from "../../auth/logged-user.service";

@Component({
    selector: "app-settings",
    templateUrl: "./account-settings.component.html",
    styleUrls: ["./account-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent extends BaseComponent implements OnInit {
    @Input(ProjectLinks.URL_PARAM_CATEGORY) public set category(value: MaybeNull<AccountSettingsTabs>) {
        this.activeTab =
            value && Object.values(AccountSettingsTabs).includes(value) ? value : AccountSettingsTabs.ACCESS_TOKENS;
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_PAGE) public set page(value: number) {
        this.currentPage = value ?? 1;
    }

    public activeTab: AccountSettingsTabs;
    public currentPage: number;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly AccountSettingsTabs: typeof AccountSettingsTabs = AccountSettingsTabs;

    public user$: Observable<MaybeNull<AccountWithEmailFragment>>;

    private accountEmailService = inject(AccountEmailService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
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
}
