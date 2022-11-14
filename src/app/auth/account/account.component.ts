import ProjectLinks from "src/app/project-links";
import { ModalService } from "./../../components/modal/modal.service";
import {
    DatasetSearchOverviewFragment,
    PageBasedInfo,
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
import { AccountTabs } from "./account.constants";
import {
    ActivatedRoute,
    NavigationEnd,
    Params,
    Router,
    RouterEvent,
} from "@angular/router";
import AppValues from "src/app/common/app.values";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { AccountService } from "src/app/services/account.service";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import { filter, map } from "rxjs/operators";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent extends BaseComponent implements OnInit {
    public accountViewType = AccountTabs.overview;
    public user: AccountDetailsFragment;
    public datasets: DatasetSearchOverviewFragment[] = [];
    public pageInfo: PageBasedInfo;
    public accountTabs = AccountTabs;
    public accountName: string;
    public datasetTotalCount: number;
    public isDropdownMenu = false;
    public currentPage = 1;
    public avatarLink: string;

    @ViewChild("containerMenu") containerMenu: ElementRef;
    @ViewChild("dropdownMenu") dropdownMenu: ElementRef;

    constructor(
        private authApi: AuthApi,
        private route: ActivatedRoute,
        private navigationService: NavigationService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private modalService: ModalService,
        private accountService: AccountService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.trackSubscriptions(
            this.route.queryParams.subscribe((params: Params) => {
                params.tab
                    ? (this.accountViewType = params.tab as AccountTabs)
                    : (this.accountViewType = AccountTabs.overview);
                params.page
                    ? (this.currentPage = params.page as number)
                    : (this.currentPage = 1);
            }),
            this.route.params.subscribe((params: Params) => {
                this.accountName = params[
                    ProjectLinks.URL_PARAM_ACCOUNT_NAME
                ] as string;
                this.getAccountInfo();
                this.getDatasets();
            }),
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => {
                    this.getDatasets();
                }),
            this.accountService.onDatasetsChanges.subscribe(
                (data: DatasetsAccountResponse) => {
                    this.datasets = data.datasets;
                    this.pageInfo = data.pageInfo;
                    this.datasetTotalCount = data.datasetTotalCount;
                    this.cdr.detectChanges();
                },
            ),
        );
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

    public get isOwner(): boolean {
        return this.authApi.currentUser?.login === this.accountName;
    }

    public onEditProfile(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onFollow(): void {
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

    private getAccountInfo(): void {
        this.accountService
            .getAccountInfoByName(this.accountName)
            .subscribe((user: AccountDetailsFragment) => {
                this.user = user;
                this.avatarLink =
                    this.user.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL;
            });
    }

    private getDatasets(): void {
        this.accountService
            .getDatasetsByAccountName(this.accountName, this.currentPage - 1)
            .subscribe();
    }
}
