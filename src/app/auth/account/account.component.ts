import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthApi } from "src/app/api/auth.api";
import { AccountDetailsFragment } from "src/app/api/kamu.graphql.interface";
import { SearchApi } from "src/app/api/search.api";
import { MaybeNull } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { AccountTabs } from "./account.constants";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
    public accountViewType = AccountTabs.overview;
    private userName: string;
    private _window: Window;
    private resizeId: NodeJS.Timer;
    private menuRowWidth: number;
    public user: MaybeNull<AccountDetailsFragment>;
    public datasets: any;
    public accountTabs = AccountTabs;
    public isDropdownMenu = false;
    public isCurrentUser = false;

    @ViewChild("containerMenu") containerMenu: ElementRef;
    @ViewChild("dropdownMenu") dropdownMenu: ElementRef;

    constructor(
        private searchApi: SearchApi,
        private authApi: AuthApi,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this._window = window;
        this.user = this.authApi.currentUser;

        // if (this.authApi.userModal) {
        //     this.user = AppValues.deepCopy(this.authApi.userModal);
        // }
        // this.authApi.onUserChanges.subscribe((user: UserInterface | {}) => {
        //     this.user = AppValues.deepCopy(user);
        // });
    }

    public ngOnInit(): void {
        this.userName = this._window.location.pathname.split("/")[1];
        console.log("name", this.userName);

        //  this.setupUrl();
        //this.onUserDatasets();
    }
    private setupUrl(): void {
        if (this._window.location.search.includes("type=currentUser")) {
            this.isCurrentUser = true;
        }
        if (
            this._window.location.search.includes("type=currentUser") &&
            !this._window.location.search.includes("tab=")
        ) {
            this.router
                .navigate([this.userName], {
                    queryParams: {
                        tab: AccountTabs.overview,
                        type: "currentUser",
                    },
                })
                .catch((e) => console.log(e));
        }
        switch (true) {
            case this.isMatchTab(AccountTabs.overview):
                this.onUserProfile();
                break;
            case this.isMatchTab(AccountTabs.datasets):
                this.onUserDatasets();
                break;
            case this.isMatchTab(AccountTabs.organizations):
                this.onUserOrganizations();
                break;
            case this.isMatchTab(AccountTabs.stars):
                this.onUserStars();
                break;
            case this.isMatchTab(AccountTabs.inbox):
                this.onUserInbox();
                break;
            default:
                this.onUserDatasets();
                break;
        }
    }

    public get isAccountViewTypeOverview(): boolean {
        return this.accountViewType === AccountTabs.overview;
    }

    public get isAccountViewTypeDatasets(): boolean {
        return this.accountViewType === AccountTabs.datasets;
    }

    private isMatchTab(tabName: string): boolean {
        return this._window.location.search.includes(`tab=${tabName}`);
    }

    public selectedTabs(accountTabKey: AccountTabs): boolean {
        if (this._window.location.search.includes(accountTabKey)) {
            return true;
        }
        return false;
    }

    public onUserProfile(): void {
        // this.router.navigate(["."], {
        //     relativeTo: this.route,
        //     queryParams: { tab: AccountTabs.overview },
        // });
        this.router
            .navigate([this.userName], {
                queryParams: {
                    tab: AccountTabs.overview,
                    type: "currentUser",
                },
            })
            .catch((e) => console.log(e));
    }
    public onSelectDataset(data: { ownerName: string; id: string }): void {
        // const id: string = data.id;
        // this.router.navigateByUrl(
        //     `/dataset/${data.ownerName}/${id}?id=${id}&type=${AppValues.urlDatasetViewOverviewType}`,
        // );
        this.router
            .navigate([this.userName], {
                queryParams: {
                    tab: AccountTabs.overview,
                    type: "currentUser",
                },
            })
            .catch((e) => console.log(e));
    }

    public onUserDatasets(): void {
        // this.router.navigate(["."], {
        //     relativeTo: this.route,
        //     queryParams: { tab: AccountTabs.datasets },
        // });

        // this.searchApi
        //     .datasetsByAccountName({
        //         accountName: this.userName,
        //         page: 0,
        //         perPage: 10,
        //         limit: 10,
        //     })
        //     .subscribe((res: DatasetsByAccountNameQuery | undefined) => {
        //         if (res) {
        //             this.datasets = res.datasets.byAccountName.nodes;
        //         }
        //     });
        this.router
            .navigate([this.userName], {
                queryParams: {
                    tab: AccountTabs.overview,
                    type: "currentUser",
                },
            })
            .catch((e) => console.log(e));
    }

    public onUserOrganizations(): void {
        // this.router.navigate(["."], {
        //     relativeTo: this.route,
        //     queryParams: { tab: AccountTabs.organizations },
        // });
        this.router
            .navigate([this.userName], {
                queryParams: {
                    tab: AccountTabs.overview,
                    type: "currentUser",
                },
            })
            .catch((e) => console.log(e));
    }

    public onUserInbox(): void {
        // this.router.navigate(["."], {
        //     relativeTo: this.route,
        //     queryParams: { tab: AccountTabs.inbox },
        // });
        this.router
            .navigate([this.userName], {
                queryParams: {
                    tab: AccountTabs.overview,
                    type: "currentUser",
                },
            })
            .catch((e) => console.log(e));
    }

    public onUserStars(): void {
        // this.router.navigate(["."], {
        //     relativeTo: this.route,
        //     queryParams: { tab: AccountTabs.stars },
        // });

        // this.searchApi
        //     .datasetsByAccountName({
        //         accountName: this.userName,
        //         page: 0,
        //         perPage: 10,
        //         limit: 10,
        //     })
        //     .subscribe((res: DatasetsByAccountNameQuery | undefined) => {
        //         if (res) {
        //             this.datasets = res.datasets.byAccountName.nodes;
        //         }
        //     });
        this.router
            .navigate([this.userName], {
                queryParams: {
                    tab: AccountTabs.overview,
                    type: "currentUser",
                },
            })
            .catch((e) => console.log(e));
    }
}
