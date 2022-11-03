import { AccountTabs } from "./auth/account/account.constants";
import { mockAccountDetails } from "./api/mock/auth.mock";
import { NavigationService } from "./services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnInit,
} from "@angular/core";
import AppValues from "./common/app.values";
import { filter, map } from "rxjs/operators";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "./interface/search.interface";
import { AuthApi } from "./api/auth.api";
import { ModalService } from "./components/modal/modal.service";
import { BaseComponent } from "./common/base.component";
import ProjectLinks from "./project-links";
import { AccountDetailsFragment } from "./api/kamu.graphql.interface";
import { MaybeNull } from "./common/app.types";
import _ from "lodash";
import { isMobileView, promiseWithCatch } from "./common/app.helpers";

export const ALL_URLS_WITHOUT_HEADER: string[] = [
    ProjectLinks.URL_DATASET_CREATE,
    ProjectLinks.URL_LOGIN,
    ProjectLinks.URL_GITHUB_CALLBACK,
];

export const ALL_URLS_WITHOUT_ACCESS_TOKEN: string[] = [
    ProjectLinks.URL_LOGIN,
    ProjectLinks.URL_GITHUB_CALLBACK,
];

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseComponent implements OnInit {
    public static readonly AnonymousAccountInfo: AccountDetailsFragment = {
        login: "",
        name: AppValues.DEFAULT_USERNAME,
    };

    public appLogo = `/${AppValues.APP_LOGO}`;
    public isMobileView = false;
    public isHeaderVisible = true;
    public user: AccountDetailsFragment = AppComponent.AnonymousAccountInfo;

    @HostListener("window:resize")
    checkWindowSize(): void {
        this.checkView();
    }

    constructor(
        private router: Router,
        private authApi: AuthApi,
        private modalService: ModalService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.checkView();
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe((event: RouterEvent) => {
                    this.isHeaderVisible = this.shouldHeaderBeVisible(
                        event.url,
                    );
                }),

            this.authApi.onUserChanges.subscribe(
                (user: MaybeNull<AccountDetailsFragment>) => {
                    this.user = user
                        ? _.cloneDeep(user)
                        : AppComponent.AnonymousAccountInfo;
                },
            ),
        );
        this.authentification();
        // Remove mock user
        this.user = this.authApi.currentUser
            ? this.authApi.currentUser
            : AppComponent.AnonymousAccountInfo;
    }

    authentification(): void {
        if (ALL_URLS_WITHOUT_ACCESS_TOKEN.includes(this.router.url)) {
            return;
        } else {
            const accessToken: string | null = localStorage.getItem(
                AppValues.LOCAL_STORAGE_ACCESS_TOKEN,
            );
            if (
                typeof accessToken === "string" &&
                !this.authApi.isAuthenticated
            ) {
                this.trackSubscription(
                    this.authApi
                        .fetchUserInfoFromAccessToken(accessToken)
                        .subscribe(),
                );
                return;
            }
        }
    }

    private checkView(): void {
        this.isMobileView = isMobileView();
    }

    private shouldHeaderBeVisible(url: string): boolean {
        return !ALL_URLS_WITHOUT_HEADER.some((item) =>
            url.toLowerCase().includes(item),
        );
    }

    public onSelectDataset(item: DatasetAutocompleteItem): void {
        if (item.__typename === TypeNames.datasetType) {
            this.navigationService.navigateToDatasetView({
                accountName: item.dataset.owner.name,
                datasetName: item.dataset.name as string,
            });
        } else {
            this.navigationService.navigateToSearch(item.dataset.id as string);
        }
    }
    public onClickAppLogo(): void {
        this.navigationService.navigateToSearch();
    }

    public onOpenUserInfo(): void {
        console.info("click onOpenUserInfo");
    }

    public onAddNew(): void {
        this.navigationService.navigateToDatasetCreate();
    }

    public onLogin(): void {
        this.navigationService.navigateToLogin();
    }

    public onLogOut(): void {
        this.authApi.logOut();
    }

    public onUserProfile(): void {
        if (this.authApi.currentUser?.login) {
            this.navigationService.navigateToOwnerView(
                this.authApi.currentUser.login,
                AccountTabs.overview,
            );
        }
    }

    public onUserDatasets(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
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
        this.navigationService.navigateToSettings();
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
