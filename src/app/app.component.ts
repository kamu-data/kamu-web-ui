import { NavigationService } from "./services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnInit,
} from "@angular/core";
import AppValues from "./common/app.values";
import { AppSearchService } from "./search/search.service";
import { filter, first, map } from "rxjs/operators";
import {
    ActivatedRoute,
    NavigationEnd,
    Params,
    Router,
    RouterEvent,
} from "@angular/router";
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
import { promiseWithCatch } from "./common/app.helpers";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseComponent implements OnInit {
    private readonly AnonymousAccountInfo: AccountDetailsFragment = {
        login: "",
        name: AppValues.defaultUsername,
    };
    private unimplementedMessage = "Feature coming soon";
    public appLogo = `/${AppValues.appLogo}`;
    public isMobileView = false;
    public searchValue = "";
    public isVisible = true;
    public user: AccountDetailsFragment = this.AnonymousAccountInfo;
    private appHeaderNotVisiblePages: string[] = [
        ProjectLinks.urlDatasetCreate,
        ProjectLinks.urlLogin,
        ProjectLinks.urlGithubCallback,
    ];

    @HostListener("window:resize", ["$event"])
    checkWindowSize(): void {
        this.checkView();
    }

    constructor(
        private router: Router,
        private appSearchService: AppSearchService,
        private authApi: AuthApi,
        private modalService: ModalService,
        private navigationService: NavigationService,
        private activatedRoute: ActivatedRoute,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.checkView();
        this.appHeaderInit();
        this.trackSubscription(
            this.authApi.onUserChanges.subscribe(
                (user: MaybeNull<AccountDetailsFragment>) => {
                    this.user = user
                        ? _.cloneDeep(user)
                        : this.AnonymousAccountInfo;
                },
            ),
        );
        this.authentification();
    }

    authentification(): void {
        const accessToken: string | null = localStorage.getItem(
            AppValues.localStorageAccessToken,
        );
        if (
            location.href.includes(ProjectLinks.urlLogin) ||
            location.href.includes(ProjectLinks.urlGithubCallback)
        ) {
            return;
        } else {
            if (typeof accessToken === "string" && !this.authApi.isAuthenticated) {
                this.trackSubscription(
                    this.authApi
                        .fetchUserInfoFromAccessToken(accessToken)
                        .subscribe(),
                );
                return;
            }
        }
    }

    private appHeaderInit(): void {
        this.trackSubscriptions(
            this.appSearchService.onSearchQueryChanges.subscribe(
                (searchValue: string) => {
                    this.searchValue = searchValue;
                },
            ),
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe((event: RouterEvent) => {
                    this.isVisible = this.isAvailableAppHeaderUrl(event.url);
                    this.getSearchQueryFromUrl();
                }),
        );
    }

    private getSearchQueryFromUrl(): void {
        this.activatedRoute.queryParams
            .pipe(first())
            .subscribe((params: Params) => {
                if (params.query) {
                    this.appSearchService.searchQueryChanges(
                        params.query as string,
                    );
                } else {
                    this.appSearchService.searchQueryChanges("");
                }
            });
    }

    private checkView(): void {
        this.isMobileView = AppValues.isMobileView();
    }
    private isAvailableAppHeaderUrl(url: string): boolean {
        return !this.appHeaderNotVisiblePages.some((item) =>
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
        this.appSearchService.searchQueryChanges("");
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
        promiseWithCatch(
            this.modalService.warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            }),
        );
    }
    public onUserDatasets(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            }),
        );
    }
    public onBilling(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            }),
        );
    }
    public onAnalytics(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            }),
        );
    }
    public onSettings(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            }),
        );
    }
    public onHelp(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            }),
        );
    }
}
