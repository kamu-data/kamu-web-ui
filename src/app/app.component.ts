import { AuthenticationError } from "./common/errors";
import { throwError } from "rxjs";
import { AccountTabs } from "./auth/account/account.constants";
import { NavigationService } from "./services/navigation.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
import AppValues from "./common/app.values";
import { filter, map } from "rxjs/operators";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { DatasetAutocompleteItem, TypeNames } from "./interface/search.interface";
import { ModalService } from "./components/modal/modal.service";
import { BaseComponent } from "./common/base.component";
import ProjectLinks from "./project-links";
import { AccountFragment, AccountType } from "./api/kamu.graphql.interface";
import { MaybeNull } from "./common/app.types";
import _ from "lodash";
import { isMobileView, promiseWithCatch } from "./common/app.helpers";
import { AppConfigService } from "./app-config.service";
import { LoggedUserService } from "./auth/logged-user.service";
import { AppConfigFeatureFlags, LoginMethod } from "./app-config.model";
import { LoginService } from "./auth/login/login.service";

export const ALL_URLS_WITHOUT_HEADER: string[] = [ProjectLinks.URL_LOGIN, ProjectLinks.URL_GITHUB_CALLBACK];

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseComponent implements OnInit {
    public static readonly ANONYMOUS_ACCOUNT_INFO: AccountFragment = {
        id: "",
        accountName: "",
        displayName: AppValues.DEFAULT_USER_DISPLAY_NAME,
        accountType: AccountType.User,
    };
    public static readonly DEFAULT_FEATURE_FLAGS: AppConfigFeatureFlags = {
        enableLogout: true,
    };

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    public isMobileView = false;
    public isHeaderVisible = true;

    public featureFlags: AppConfigFeatureFlags = AppComponent.DEFAULT_FEATURE_FLAGS;
    public loggedAccount: AccountFragment = AppComponent.ANONYMOUS_ACCOUNT_INFO;
    public loginMethods: LoginMethod[] = [];

    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.checkView();
    }

    constructor(
        private router: Router,
        private loginService: LoginService,
        private loggedUserService: LoggedUserService,
        private modalService: ModalService,
        private navigationService: NavigationService,
        private appConfigService: AppConfigService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.readConfiguration();
        this.checkView();

        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe((event: RouterEvent) => {
                    this.isHeaderVisible = this.shouldHeaderBeVisible(event.url);
                }),

            this.loggedUserService.loggedInUserChanges.subscribe((user: MaybeNull<AccountFragment>) => {
                this.loggedAccount = user ? _.cloneDeep(user) : AppComponent.ANONYMOUS_ACCOUNT_INFO;
                this.cdr.detectChanges();
            }),
        );
    }

    private readConfiguration(): void {
        this.featureFlags = this.appConfigService.featureFlags;
        this.loginMethods = this.loginService.loginMethods;
    }

    private checkView(): void {
        this.isMobileView = isMobileView();
    }

    private shouldHeaderBeVisible(url: string): boolean {
        return !ALL_URLS_WITHOUT_HEADER.some((item) => url.toLowerCase().includes(item));
    }

    public onSelectedDataset(item: DatasetAutocompleteItem): void {
        if (item.__typename === TypeNames.datasetType) {
            this.navigationService.navigateToDatasetView({
                accountName: item.dataset.owner.accountName,
                datasetName: item.dataset.name,
            });
        } else {
            this.navigationService.navigateToSearch(item.dataset.id);
        }
    }

    public onAppLogo(): void {
        this.navigationService.navigateToSearch();
    }

    public onOpenUserInfo(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public onAddNew(): void {
        this.navigationService.navigateToDatasetCreate();
    }

    public onLogin(): void {
        this.navigationService.navigateToLogin();
    }

    public onLogout(): void {
        this.loggedUserService.logout();
    }

    public onUserProfile(): void {
        if (this.loggedUserService.currentlyLoggedInUser?.accountName) {
            this.navigationService.navigateToOwnerView(
                this.loggedUserService.currentlyLoggedInUser.accountName,
                AccountTabs.OVERVIEW,
            );
        } else {
            throwError(() => new AuthenticationError([new Error("Login is undefined")]));
        }
    }

    public onUserDatasets(): void {
        if (this.loggedUserService.currentlyLoggedInUser?.accountName) {
            this.navigationService.navigateToOwnerView(
                this.loggedUserService.currentlyLoggedInUser.accountName,
                AccountTabs.DATASETS,
            );
        } else {
            throwError(() => new AuthenticationError([new Error("Login is undefined")]));
        }
    }

    public onBilling(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onAnalytics(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onSettings(): void {
        if (this.loggedUserService.currentlyLoggedInUser?.accountName) {
            this.navigationService.navigateToSettings();
        } else {
            throwError(() => new AuthenticationError([new Error("Login is undefined")]));
        }
    }

    public onHelp(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }
}
