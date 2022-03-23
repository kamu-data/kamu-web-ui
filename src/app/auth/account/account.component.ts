import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
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
import {Element} from "@angular/compiler";

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

            debugger;
            const allNewList = $(".UnderlineNav-body > .UnderlineNav-item.hidden").get();

            if (this.dropdownMenu.nativeElement.children.length > 0) {
                while (this.dropdownMenu.nativeElement.firstChild) {
                    this.dropdownMenu.nativeElement.firstChild.remove();
                }
            }
            allNewList.forEach((elem: any) => {
                this.dropdownMenu.nativeElement.insertAdjacentHTML("beforeend", elem.outerHTML);
            });

            const dropdownMenu = $("#dropdownMenu button").get();

            dropdownMenu.forEach((elem: any) => {
                elem.classList.remove("hidden");
            });

            this.isDropdownMenu = dropdownMenu.length > 0;

        }, 500);
    }

    constructor(
        private searchApi: SearchApi,
        private authApi: AuthApi,
        private route: ActivatedRoute,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef
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
        setTimeout(() => {
            if (this.containerMenu) {
                this.menuRowWidth = this.containerMenu.nativeElement.getBoundingClientRect().width;
                this.checkWindowSize();
            }
        });
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
