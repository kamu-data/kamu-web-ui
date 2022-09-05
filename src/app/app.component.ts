import { NavigationService } from "./services/navigation.service";
import { Component, HostListener, OnInit } from "@angular/core";
import AppValues from "./common/app.values";
import { AppSearchService } from "./search/search.service";
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
import { AccountInfo } from "./api/kamu.graphql.interface";
import { MaybeNull } from "./common/app.types";
import _ from "lodash";
import { DatasetViewTypeEnum } from "./dataset-view/dataset-view.interface";
import { logError } from "./common/app.helpers";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"],
})
export class AppComponent extends BaseComponent implements OnInit {
    private readonly AnonymousAccountInfo: AccountInfo = {
        login: "",
        name: AppValues.defaultUsername,
    };
    private unimplementedMessage = "Feature coming soon";
    public appLogo = `/${AppValues.appLogo}`;
    public isMobileView = false;
    public searchValue = "";
    public isVisible = true;
    public user: AccountInfo;
    private appHeaderNotVisiblePages: string[] = [
        ProjectLinks.urlDatasetCreate,
        ProjectLinks.urlLogin,
        ProjectLinks.urlGithubCallback,
    ];

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.checkView();
    }

    constructor(
        private router: Router,
        private appSearchService: AppSearchService,
        private authApi: AuthApi,
        private modalService: ModalService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.checkView();
        this.appHeaderInit();
        this.trackSubscription(
            this.authApi.onUserChanges.subscribe(
                (user: MaybeNull<AccountInfo>) => {
                    this.user = user
                        ? _.cloneDeep(user)
                        : this.AnonymousAccountInfo;
                },
            ),
        );
        this.authentification();
    }

    authentification(): void {
        const code: string | null = localStorage.getItem(
            AppValues.localStorageCode,
        );

        if (
            location.href.includes(ProjectLinks.urlLogin) ||
            location.href.includes(ProjectLinks.urlGithubCallback)
        ) {
            return;
        } else {
            if (typeof code === "string" && !this.authApi.isAuthUser) {
                this.trackSubscription(
                    this.authApi.getUserInfoAndToken(code).subscribe(),
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

                    if (event.url.split("?query=").length > 1) {
                        const searchValue: string =
                            AppValues.fixedEncodeURIComponent(
                                event.url.split("?query=")[1].split("&")[0],
                            );
                        if (searchValue === "%255Bobject%2520Object%255D") {
                            this.navigationService.navigateToSearch();
                            setTimeout(() =>
                                this.appSearchService.searchQueryChanges(""),
                            );
                        }
                        if (event.url.includes(ProjectLinks.urlSearch)) {
                            this.appSearchService.searchQueryChanges(
                                searchValue,
                            );
                        }
                        if (!event.url.includes(ProjectLinks.urlSearch)) {
                            this.appSearchService.searchQueryChanges("");
                        }
                    }
                }),
        );
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
                tab: DatasetViewTypeEnum.Overview,
            });
        } else {
            this.navigationService.navigateToSearch(
                item.dataset.id as string,
                1,
            );
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
        this.modalService
            .warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            })
            .catch((e) => logError(e));
    }
    public onUserDatasets(): void {
        this.modalService
            .warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            })
            .catch((e) => logError(e));
    }
    public onBilling(): void {
        this.modalService
            .warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            })
            .catch((e) => logError(e));
    }
    public onAnalytics(): void {
        this.modalService
            .warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            })
            .catch((e) => logError(e));
    }
    public onSettings(): void {
        this.modalService
            .warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            })
            .catch((e) => logError(e));
    }
    public onHelp(): void {
        this.modalService
            .warning({
                message: this.unimplementedMessage,
                yesButtonText: "Ok",
            })
            .catch((e) => logError(e));
    }
}
