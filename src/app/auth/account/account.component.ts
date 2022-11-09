import { ModalService } from "./../../components/modal/modal.service";
import {
    DatasetsByAccountNameQuery,
    DatasetSearchOverviewFragment,
    PageBasedInfo,
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
import {
    ActivatedRoute,
    NavigationEnd,
    Params,
    Router,
    RouterEvent,
} from "@angular/router";
import { filter, map } from "rxjs/operators";
import AppValues from "src/app/common/app.values";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { DatasetApi } from "src/app/api/dataset.api";

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
    public pageInfo: PageBasedInfo;
    public accountTabs = AccountTabs;
    public accountName: string;
    public datasetTotalCount: number;
    public isClickableRow = true;
    public isDropdownMenu = false;
    public isCurrentUser = false;
    public currentPage = 1;

    @ViewChild("containerMenu") containerMenu: ElementRef;
    @ViewChild("dropdownMenu") dropdownMenu: ElementRef;

    constructor(
        private authApi: AuthApi,
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
        private cdr: ChangeDetectorRef,
        private modalService: ModalService,
        private datasetApi: DatasetApi,
    ) {
        super();
        this._window = window;
        this.user = this.authApi.currentUser;
    }

    public ngOnInit(): void {
        this.trackSubscriptions(
            this.route.queryParams.subscribe((param: Params) => {
                param.tab
                    ? (this.accountViewType = param.tab as AccountTabs)
                    : (this.accountViewType = AccountTabs.overview);

                if (param.page) {
                    this.currentPage = param.page as number;
                }
            }),
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => this.getDatasets()),
        );
        if (this.user) {
            this.accountName = this.user.login;
            this.getDatasets();
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

    public onEditProfile(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onSelectOverviewTab(): void {
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.overview,
        );
    }
    public onSelectDatasetsTab(): void {
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.datasets,
        );
    }

    public onSelectOrganizationsTab(): void {
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.organizations,
        );
    }

    public onSelectInboxTab(): void {
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.inbox,
        );
    }

    public onSelectStarsTab(): void {
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.stars,
        );
    }

    public onSelectDataset(row: DatasetSearchOverviewFragment): void {
        this.navigationService.navigateToDatasetView({
            accountName: (row.owner as User).name,
            datasetName: row.name as string,
        });
    }

    public onPageChange(params: {
        currentPage?: number;
        isClick?: boolean;
    }): void {
        params.currentPage
            ? (this.currentPage = params.currentPage)
            : (this.currentPage = 1);
        if (this.currentPage === 1) {
            this.navigationService.navigateToOwnerView(
                this.accountName,
                this.accountViewType,
            );
            return;
        }
        this.navigationService.navigateToOwnerView(
            this.accountName,
            this.accountViewType,
            params.currentPage,
        );
    }

    private getDatasets(): void {
        this.datasetApi
            .fetchDatasetsByAccountName(this.accountName, this.currentPage - 1)
            .subscribe((data: DatasetsByAccountNameQuery) => {
                this.datasets = data.datasets.byAccountName.nodes;
                this.pageInfo = data.datasets.byAccountName.pageInfo;
                this.datasetTotalCount = data.datasets.byAccountName.totalCount;
                this.cdr.detectChanges();
            });
    }
}
