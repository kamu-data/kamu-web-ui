import { AccountService } from "src/app/services/account.service";
import { BaseComponent } from "src/app/common/base.component";
import {
    ActivatedRoute,
    NavigationEnd,
    Params,
    Router,
    RouterEvent,
} from "@angular/router";
import { NavigationService } from "./../../../../services/navigation.service";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Input,
    OnInit,
} from "@angular/core";
import { Component } from "@angular/core";
import {
    DatasetSearchOverviewFragment,
    PageBasedInfo,
    User,
} from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";
import { filter, map } from "rxjs/operators";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    styleUrls: ["./datasets-tab.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent extends BaseComponent implements OnInit {
    @Input() public datasets: DatasetSearchOverviewFragment[];
    @Input() public accountName: string;
    @Input() public accountViewType: AccountTabs;
    @Input() public pageInfo: PageBasedInfo;
    public currentPage = 1;

    public isClickableRow = true;

    constructor(
        private navigationService: NavigationService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getDatasets();
        this.trackSubscriptions(
            this.route.queryParams.subscribe((params: Params) => {
                if (params.page) {
                    this.currentPage = params.page as number;
                }
            }),
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => this.getDatasets()),
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
        this.accountService
            .getDatasetsByAccountName(this.accountName, this.currentPage - 1)
            .subscribe();
    }
}
