import { BaseComponent } from "src/app/common/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
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
export class AccountComponent extends BaseComponent implements OnInit {
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
        private navigationService: NavigationService,
    ) {
        super();
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
        this.trackSubscription(
            this.route.queryParams.subscribe((param: Params) => {
                if (param.tab) {
                    this.accountViewType = param.tab as AccountTabs;
                }
            }),
        );
        if (this.user?.name) {
            this.userName = this.user.name;
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

    private navigateTo(type: string): void {
        if (this.user?.login) {
            this.navigationService.navigateToOwnerView(this.user.login, type);
            this.accountViewType = type as AccountTabs;
        }
    }
}
