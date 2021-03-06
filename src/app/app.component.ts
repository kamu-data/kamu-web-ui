import { Component, HostListener, OnInit } from "@angular/core";
import AppValues from "./common/app.values";
import { AppSearchService } from "./search/search.service";
import { filter } from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { DatasetIDsInterface, TypeNames } from "./interface/search.interface";
import { AuthApi } from "./api/auth.api";
import { UserInterface } from "./interface/auth.interface";
import { ModalService } from "./components/modal/modal.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"],
})
export class AppComponent implements OnInit {
    private unimplementedMessage = "Feature coming soon";
    public appLogo = `/${AppValues.appLogo}`;
    public isMobileView = false;
    public searchValue: any = "";
    public isVisible = true;
    public user: UserInterface;
    private appHeaderNotVisiblePages: string[] = [
        AppValues.urlDatasetCreate,
        AppValues.urlLogin,
        AppValues.urlGithubCallback,
    ];
    private _window: Window;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.checkView();
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private appSearchService: AppSearchService,
        private authApi: AuthApi,
        private modalService: ModalService,
    ) {
        this._window = window;
    }

    public ngOnInit(): void {
        this.checkView();
        this.appHeaderInit();
        this.authApi.onUserChanges.subscribe((user: UserInterface | {}) => {
            this.user = AppValues.deepCopy(user);
        });
        this.authentification();
    }

    authentification(): void {
        const code: string | null = localStorage.getItem(
            AppValues.localStorageCode,
        );

        if (
            location.href.includes(AppValues.urlLogin) ||
            location.href.includes(AppValues.urlGithubCallback)
        ) {
            return;
        } else {
            if (typeof code === "string" && !this.authApi.isAuthUser) {
                this.authApi.getUserInfoAndToken(code).subscribe();
                return;
            }
        }
    }

    private appHeaderInit(): void {
        this.appSearchService.onSearchChanges.subscribe(
            (searchValue: string) => {
                this.searchValue = searchValue;
            },
        );

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.isVisible = this.isAvailableAppHeaderUrl(event.url);

                if (event.url.split("?id=").length > 1) {
                    const searchValue: string =
                        AppValues.fixedEncodeURIComponent(
                            event.url.split("?id=")[1].split("&")[0],
                        );
                    if (searchValue === "%255Bobject%2520Object%255D") {
                        this.router.navigate(["search"]);
                        setTimeout(() =>
                            this.appSearchService.searchChanges(""),
                        );
                    }
                    if (event.url.includes("search")) {
                        this.appSearchService.searchChanges(searchValue);
                    }
                    if (event.url.includes("dataset-view")) {
                        this.appSearchService.searchChanges("");
                    }
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

    public onSelectDataset(item: DatasetIDsInterface): void {
        console.log(
            "item.__typename: " +
                item.__typename +
                " ; " +
                "item.id:" +
                item.id,
        );
        if (item.__typename === TypeNames.datasetType) {
            this.router.navigate(
                [AppValues.defaultUsername, AppValues.urlDatasetView],
                {
                    queryParams: {
                        id: item.id,
                        type: AppValues.urlDatasetViewOverviewType,
                    },
                },
            );
        } else {
            this.router.navigate([AppValues.urlSearch], {
                queryParams: { id: item.id, p: 1 },
            });
        }
    }
    public onClickAppLogo(): void {
        this.router.navigate([AppValues.urlSearch]);
        this.appSearchService.searchChanges("");
    }

    public onOpenUserInfo(): void {
        // tslint:disable-next-line:no-console
        console.info("click onOpenUserInfo");
    }

    public onAddNew(): void {
        this.router.navigate([
            AppValues.defaultUsername,
            AppValues.urlDatasetCreate,
        ]);
    }

    public onLogin(): void {
        this.router.navigate([AppValues.urlLogin]);
    }
    public onLogOut(): void {
        this.authApi.logOut();
    }
    public onUserProfile(): void {
        this.modalService.warning({
            message: this.unimplementedMessage,
            yesButtonText: "Ok",
        });
    }
    public onUserDatasets(): void {
        this.modalService.warning({
            message: this.unimplementedMessage,
            yesButtonText: "Ok",
        });
    }
    public onBilling(): void {
        this.modalService.warning({
            message: this.unimplementedMessage,
            yesButtonText: "Ok",
        });
    }
    public onAnalytics(): void {
        this.modalService.warning({
            message: this.unimplementedMessage,
            yesButtonText: "Ok",
        });
    }
    public onSettings(): void {
        this.modalService.warning({
            message: this.unimplementedMessage,
            yesButtonText: "Ok",
        });
    }
    public onHelp(): void {
        this.modalService.warning({
            message: this.unimplementedMessage,
            yesButtonText: "Ok",
        });
    }
}
