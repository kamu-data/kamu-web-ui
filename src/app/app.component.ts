import { NavigationService } from "./services/navigation.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, OnInit } from "@angular/core";
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
import { AppUIConfigFeatureFlags, LoginMethod } from "./app-config.model";
import { LoginService } from "./auth/login/login.service";
import { loadErrorMessages } from "@apollo/client/dev";
import { isDevMode } from "@angular/core";
import moment from "moment";
import { LoggedUserService } from "./auth/logged-user.service";
import packageFile from "../../package.json";
import { LocalStorageService } from "./services/local-storage.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
        isAdmin: false,
    };

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    public isMobileView = false;
    public isHeaderVisible = true;

    public featureFlags: AppUIConfigFeatureFlags = AppValues.DEFAULT_UI_FEATURE_FLAGS;
    public loggedAccount: AccountFragment = AppComponent.ANONYMOUS_ACCOUNT_INFO;
    public loginMethods: LoginMethod[] = [];

    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.checkView();
    }

    private router = inject(Router);
    private loginService = inject(LoginService);
    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);
    private appConfigService = inject(AppConfigService);
    private cdr = inject(ChangeDetectorRef);
    private loggedUserService = inject(LoggedUserService);
    private localStorageService = inject(LocalStorageService);

    public ngOnInit(): void {
        if (isDevMode()) {
            loadErrorMessages();
        }
        this.outputAppVersion();
        this.setMomentOptions();
        this.readConfiguration();
        this.checkView();

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event) => event as RouterEvent),
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: RouterEvent) => {
                this.isHeaderVisible = this.shouldHeaderBeVisible(event.url);
            });

        this.loggedUserService.loggedInUserChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user: MaybeNull<AccountFragment>) => {
                this.loggedAccount = user ? _.cloneDeep(user) : AppComponent.ANONYMOUS_ACCOUNT_INFO;
                this.cdr.detectChanges();
            });
    }

    private setMomentOptions(): void {
        moment.relativeTimeThreshold("s", 59);
        moment.relativeTimeThreshold("m", 59);
        moment.relativeTimeThreshold("h", 23);
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

    private outputAppVersion(): void {
        // eslint-disable-next-line no-console
        console.info(`%c Kamu UI v${packageFile.version} `, "background-color: rgb(105, 228, 187); font-size: 18px;");
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

    public onOpenUserInfo(): void {
        // Not implemented yet
    }

    public onLogin(): void {
        this.localStorageService.setRedirectAfterLoginUrl(this.router.url);
        this.navigationService.navigateToLogin();
    }

    public onLogout(): void {
        this.loggedUserService.logout();
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

    public onHelp(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onDashboard(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
        //TODO: Implement AdminDashBoardComponent
        //  this.navigationService.navigateToAdminDashBoard();
    }
}
