import {
    DatasetsByAccountNameQuery,
    DatasetSearchOverviewFragment,
    User,
} from "./../../api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { AuthApi } from "src/app/api/auth.api";
import { AccountDetailsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { AccountTabs } from "./account.constants";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends BaseComponent implements OnInit {
    public accountViewType = AccountTabs.overview;
    private _window: Window;
    private resizeId: NodeJS.Timer;
    private menuRowWidth: number;
    public user: MaybeNull<AccountDetailsFragment>;
    public datasets: DatasetSearchOverviewFragment[] = [];
    public accountTabs = AccountTabs;
    public isClickableRow = true;
    public isDropdownMenu = false;
    public isCurrentUser = false;

    @ViewChild("containerMenu") containerMenu: ElementRef;
    @ViewChild("dropdownMenu") dropdownMenu: ElementRef;

    constructor(
        private authApi: AuthApi,
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
        this._window = window;
        this.user = this.authApi.currentUser;
    }

    public ngOnInit(): void {
        this.trackSubscription(
            this.route.queryParams.subscribe((param: Params) => {
                if (param.tab) {
                    this.accountViewType = param.tab as AccountTabs;
                }
            }),
        );
        if (this.user) {
            this.authApi
                .fetchDatasetsByAccountName(this.user.login)
                .subscribe((data: DatasetsByAccountNameQuery) => {
                    this.datasets = data.datasets.byAccountName.nodes;
                    this.cdr.detectChanges();
                });
        }
    }

    public get isAccountViewTypeOverview(): boolean {
        return this.accountViewType === AccountTabs.overview;
    }

    public get isAccountViewTypeDatasets(): boolean {
        return this.accountViewType === AccountTabs.datasets;
    }

    public get isAccountViewTypeOrganizations(): boolean {
        return this.accountViewType === AccountTabs.organizations;
    }

    public get isAccountViewTypeInbox(): boolean {
        return this.accountViewType === AccountTabs.inbox;
    }

    public get isAccountViewTypeStars(): boolean {
        return this.accountViewType === AccountTabs.stars;
    }

    public selectedTabs(accountTabKey: AccountTabs): boolean {
        if (this._window.location.search.includes(accountTabKey)) {
            return true;
        }
        return false;
    }

    public onSelectOverviewTab(): void {
        this.navigateTo(AccountTabs.overview);
    }
    public onSelectDatasetsTab(): void {
        this.navigateTo(AccountTabs.datasets);
    }

    public onSelectOrganizationsTab(): void {
        this.navigateTo(AccountTabs.organizations);
    }

    public onSelectInboxTab(): void {
        this.navigateTo(AccountTabs.inbox);
    }

    public onSelectStarsTab(): void {
        this.navigateTo(AccountTabs.stars);
    }

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: (row.owner as User).name,
            datasetName: row.name as string,
        });
    }

    private navigateTo(type: string): void {
        if (this.user?.login) {
            this.navigationService.navigateToOwnerView(this.user.login, type);
            this.accountViewType = type as AccountTabs;
        }
    }
}
