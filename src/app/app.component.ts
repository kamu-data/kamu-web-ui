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
import { isMobileView, promiseWithCatch } from "./common/app.helpers";
import { AppConfigService } from "./app-config.service";
import { AppUIConfigFeatureFlags, LoginMethod } from "./app-config.model";
import { LoginService } from "./auth/login/login.service";
import { loadErrorMessages } from "@apollo/client/dev";
import { isDevMode } from "@angular/core";
import { LoggedUserService } from "./auth/logged-user.service";
import packageFile from "../../package.json";
import { LocalStorageService } from "./services/local-storage.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

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
    private matIconRegistry = inject(MatIconRegistry);
    private domSanitizer = inject(DomSanitizer);

    public ngOnInit(): void {
        if (isDevMode()) {
            loadErrorMessages();
        }
        this.registerMaterialIcons();
        this.outputAppVersion();
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
                this.loggedAccount = user ? structuredClone(user) : AppComponent.ANONYMOUS_ACCOUNT_INFO;
                this.cdr.detectChanges();
            });
    }

    private readConfiguration(): void {
        this.featureFlags = this.appConfigService.featureFlags;
        this.loginMethods = this.loginService.loginMethods;
    }

    private checkView(): void {
        this.isMobileView = isMobileView();
    }

    private registerMaterialIcons(): void {
        this.matIconRegistry
            .addSvgIcon("history", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/history.svg"))
            .addSvgIcon("public-profile", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/profile.svg"))
            .addSvgIcon("account", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/account.svg"))
            .addSvgIcon("appearance", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/appearance.svg"))
            .addSvgIcon(
                "accessibility",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/accessibility.svg"),
            )
            .addSvgIcon(
                "notifications",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/notifications.svg"),
            )
            .addSvgIcon("billing", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/billing.svg"))
            .addSvgIcon("emails", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/emails.svg"))
            .addSvgIcon("security", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/security.svg"))
            .addSvgIcon(
                "organizations",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/organizations.svg"),
            )
            .addSvgIcon("sign-out", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/sign-out.svg"))
            .addSvgIcon(
                "notifications-large",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/notifications-large.svg"),
            )
            .addSvgIcon(
                "verified-commit",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/verified-commit.svg"),
            )
            .addSvgIcon("git-commit", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/git-commit.svg"))
            .addSvgIcon("copy", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/copy.svg"))
            .addSvgIcon("code-square", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/code-square.svg"))
            .addSvgIcon("pencil", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/pencil.svg"))
            .addSvgIcon("repository", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/repository.svg"))
            .addSvgIcon("checked", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/checked.svg"))
            .addSvgIcon(
                "notifications-checked",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/notifications-checked.svg"),
            )
            .addSvgIcon("search", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/search.svg"))
            .addSvgIcon("public", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/public.svg"))
            .addSvgIcon("private", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/private.svg"))
            .addSvgIcon("information", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/information.svg"))
            .addSvgIcon("github-logo", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/git-hub.svg"))
            .addSvgIcon(
                "show-options",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/show-options.svg"),
            )
            .addSvgIcon("timer", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/timer.svg"))
            .addSvgIcon("clock", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/clock.svg"))
            .addSvgIcon("hour-glass", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/hour-glass.svg"))
            .addSvgIcon("compact", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/compress.svg"))
            .addSvgIcon(
                "access-token",
                this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/svg/access-token.svg"),
            );
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
        if (!this.localStorageService.redirectAfterLoginUrl) {
            this.localStorageService.setRedirectAfterLoginUrl(this.router.url);
        }
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
