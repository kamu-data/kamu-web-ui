import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from "@angular/core";
import {UserInterface} from "../../interface/auth.interface";
import AppValues from "../../common/app.values";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthApi} from "../../api/auth.api";
import {SearchApi} from "../../api/search.api";
import {DatasetsByAccountNameQuery} from "../../api/kamu.graphql.interface";
import {AccountTabs} from "./account.constants";
// @ts-ignore
import * as $ from "jquery";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
})
export class AccountComponent implements OnInit {

    private userName: string;
    private _window: Window;
    private resizeId: NodeJS.Timer;
    private menuRowWidth: number;

    public user: UserInterface;
    public datasets: any;
    public accountTabs = AccountTabs;
    public isDropdownMenu = false;
    public isCurrentUser = false;

    @ViewChild("containerMenu") containerMenu: ElementRef;
    @ViewChild("dropdownMenu") dropdownMenu: ElementRef;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize() {
        clearTimeout(this.resizeId);
        this.resizeId = setTimeout(() => {
            const allList = $(".UnderlineNav-body > .UnderlineNav-item").get().reverse();
            allList.forEach((child: any) => {
                if (window.outerWidth < child.getBoundingClientRect().left + (child.getBoundingClientRect().width) && !child.className.includes("hidden")) {
                    child.classList.add("hidden");
                } else if (this.menuRowWidth <= window.outerWidth && window.outerWidth >= child.getBoundingClientRect().left + (child.getBoundingClientRect().width + 50) && child.className.includes("hidden")) {
                    child.classList.remove("hidden");
                }
            });

            const allNewList = $(".UnderlineNav-body > .UnderlineNav-item.hidden").get();
            const hiddenButtonNames: string[] = [];

            if (this.dropdownMenu) {
                allNewList.forEach((elem: any) => {
                    hiddenButtonNames.push(elem.getAttribute("data-tab-item"));
                });

                const dropdownMenu = $("#dropdownMenu button").get();

                dropdownMenu.forEach((elem: any) => {
                    if (hiddenButtonNames.length && hiddenButtonNames.some((name: string) => name === elem.getAttribute("data-tab-item"))) {
                        elem.classList.remove("hidden");
                    } else {
                        elem.classList.add("hidden");
                    }
                });

                this.isDropdownMenu = hiddenButtonNames.length > 0;
            }

        }, 500);
    }

    constructor(
        private searchApi: SearchApi,
        private authApi: AuthApi,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        debugger
        this._window = window;
        if (this.authApi.userModal) {
            this.user = AppValues.deepCopy(this.authApi.userModal);
        }
        this.authApi.onUserChanges.subscribe((user: UserInterface | {}) => {
            this.user = AppValues.deepCopy(user);
        });
    }

    public ngOnInit(): void {
        debugger
        this.userName = this._window.location.pathname.split("/username/")[1];

        this.setupUrl();
        this.onUserDatasets();

        setTimeout(() => {
            if (this.containerMenu) {
                this.menuRowWidth = this.containerMenu.nativeElement.getBoundingClientRect().width;
                this.checkWindowSize();
            }
        });
    }
    private setupUrl(): void {
        if (this._window.location.search.includes("type=currentUser")) {
           this.isCurrentUser = true;
        }
        if (this._window.location.search.includes("type=currentUser") && !this._window.location.search.includes("tab=")) {
            this.router.navigate([this.userName], {
                queryParams: {tab: AccountTabs.overview, type: "currentUser"}
            });
        }
        switch (true) {
            case (this.isMatchTab(AccountTabs.overview)):
                this.onUserProfile();
                break;
            case (this.isMatchTab(AccountTabs.datasets)):
                this.onUserDatasets();
                break;
            case (this.isMatchTab(AccountTabs.organizations)):
                this.onUserOrganizations();
                break;
            case (this.isMatchTab(AccountTabs.stars)):
                this.onUserStars();
                break;
            case (this.isMatchTab(AccountTabs.inbox)):
                this.onUserInbox();
                break;
            default:
                this.onUserDatasets();
                break;
        }
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
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {tab: AccountTabs.overview}});
    }
    public onSelectDataset(data: { ownerName: string; id: string }): void {
        const id: string = data.id;
        this.router.navigateByUrl(`/dataset/${data.ownerName}/${id}?id=${id}&type=${AppValues.urlDatasetViewOverviewType}`);
    }

    public onUserDatasets(): void {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {tab: AccountTabs.datasets}});

        this.searchApi.datasetsByAccountName({accountName: this.userName, page: 0, perPage: 10, limit: 10})
        .subscribe((res: DatasetsByAccountNameQuery | undefined) => {
            if (res) {
                this.datasets = res.datasets.byAccountName.nodes;
            }
        });
    }

    public onUserOrganizations(): void {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {tab: AccountTabs.organizations}});
    }

    public onUserInbox(): void {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {tab: AccountTabs.inbox}});
    }

    public onUserStars(): void {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {tab: AccountTabs.stars}});

        this.searchApi.datasetsByAccountName({accountName: this.userName, page: 0, perPage: 10, limit: 10})
        .subscribe((res: DatasetsByAccountNameQuery | undefined) => {
            if (res) {
                this.datasets = res.datasets.byAccountName.nodes;
            }
        });
    }
}
