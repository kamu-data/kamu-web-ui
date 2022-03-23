import {Component, OnInit} from "@angular/core";
import {UserInterface} from "../../interface/auth.interface";
import AppValues from "../../common/app.values";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthApi} from "../../api/auth.api";
import {SearchApi} from "../../api/search.api";
import {DatasetsByAccountNameQuery} from "../../api/kamu.graphql.interface";
import {AccountTabs} from "./account.constants";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
})
export class AccountComponent implements OnInit {

    private userName: string;

    public user: UserInterface;
    public datasets: any;
    public accountTabs = AccountTabs;
    private _window: Window;

    constructor(
        private searchApi: SearchApi,
        private authApi: AuthApi,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this._window = window;
        if (this.authApi.userModal) {
            this.user = AppValues.deepCopy(this.authApi.userModal);
        }
        this.authApi.onUserChanges.subscribe((user: UserInterface | {}) => {
            this.user = AppValues.deepCopy(user);
        });
    }

    public ngOnInit(): void {
        this.userName = this._window.location.pathname.split("?tab=")[0].slice(1);

        if (!this._window.location.search.includes("tab")) {
            this.router.navigate([this.userName], {
                queryParams: {tab: AccountTabs.overview}
            });
        }

        if (this._window.location.search.includes(AccountTabs.datasets)) {
            this.onUserDatasets();
        }
    }

    public selectedTabs(accountTabKey: AccountTabs): boolean {
        if (this._window.location.search.includes(accountTabKey)) {
            return true;
        }
        return false;
    }

    public onUserProfile(): void {
        this.router.navigate([this.userName], {
            queryParams: {tab: AccountTabs.overview}
        });
    }
    public onSelectDataset(data: { ownerName: string; id: string }): void {
        const id: string = data.id;
        this.router.navigate([data.ownerName, AppValues.urlDatasetView], {
            queryParams: { id, type: AppValues.urlDatasetViewOverviewType },
        });
    }

    public onUserDatasets(): void {
        this.searchApi.datasetsByAccountName({accountName: this.userName, page: 0, perPage: 10, limit: 10})
        .subscribe((res: DatasetsByAccountNameQuery | undefined) => {
            if (res) {
                this.datasets = res.datasets.byAccountName.nodes;
            }

            this.router.navigate([this.userName], {
                queryParams: {tab: AccountTabs.datasets}
            });
        });
    }

    public onUserOrganizations(): void {
        this.router.navigate([this.userName], {
            queryParams: {tab: AccountTabs.organizations}
        });
    }

    public onUserInbox(): void {
        this.router.navigate([this.userName], {
            queryParams: {tab: AccountTabs.inbox}
        });
    }

    public onUserStars(): void {
        debugger;
        this.router.navigate([this.userName], {
            queryParams: {tab: AccountTabs.stars}
        });
    }
}
