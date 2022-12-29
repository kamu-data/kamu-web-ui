import {
    ActivatedRoute,
    NavigationEnd,
    Params,
    Router,
    RouterEvent,
} from "@angular/router";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { Observable, OperatorFunction } from "rxjs";
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
} from "rxjs/operators";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "../../interface/search.interface";
import { SearchApi } from "../../api/search.api";
import AppValues from "../../common/app.values";
import { BaseComponent } from "src/app/common/base.component";
import { AccountDetailsFragment } from "src/app/api/kamu.graphql.interface";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent extends BaseComponent implements OnInit {
    @Input() public appLogo: string;
    @Input() public isMobileView: boolean;
    @Input() public isVisible: boolean;
    @Input() public userInfo: AccountDetailsFragment;

    @Output() public selectDatasetEmitter =
        new EventEmitter<DatasetAutocompleteItem>();
    @Output() public addNewEmitter = new EventEmitter<null>();
    @Output() public loginEmitter = new EventEmitter<null>();
    @Output() public logOutEmitter = new EventEmitter<null>();
    @Output() public userProfileEmitter = new EventEmitter<null>();
    @Output() public clickAppLogoEmitter = new EventEmitter<null>();
    @Output() public clickSettingsEmitter = new EventEmitter<null>();
    @Output() public clickHelpEmitter = new EventEmitter<null>();
    @Output() public clickAnalyticsEmitter = new EventEmitter<null>();
    @Output() public clickBillingEmitter = new EventEmitter<null>();
    @Output() public clickUserDatasetsEmitter = new EventEmitter<null>();
    @Output() public clickUserProfileEmitter = new EventEmitter<null>();

    @ViewChild("appHeaderMenuButton")
    appHeaderMenuButton: ElementRef<HTMLElement>;

    public defaultUsername: string = AppValues.DEFAULT_USERNAME;
    public isSearchActive = false;
    public isCollapsedAppHeaderMenu = false;
    public searchQuery = "";

    constructor(
        private appSearchAPI: SearchApi,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private navigationService: NavigationService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe((event: RouterEvent) => {
                    if (
                        !event.url.includes(
                            `?${ProjectLinks.URL_QUERY_PARAM_QUERY}=`,
                        )
                    ) {
                        this.searchQuery = "";
                        this.cdr.detectChanges();
                    }
                }),
            this.route.queryParams.subscribe((param: Params) => {
                if (param.query) {
                    this.searchQuery = param.query as string;
                }
            }),
        );
    }

    public isDatasetType(type: string): boolean {
        return type === TypeNames.datasetType;
    }

    public isUserLoggedIn(): boolean {
        return this.userInfo.login.length > 0;
    }

    public search: OperatorFunction<
        string,
        readonly DatasetAutocompleteItem[]
    > = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) =>
                this.appSearchAPI.autocompleteDatasetSearch(term),
            ),
        );
    };

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? (x.dataset.name as string) : x;
    }

    public onClickInput(): void {
        const typeaheadInput: HTMLElement | null =
            document.getElementById("typeahead-http");
        if (typeaheadInput) {
            typeaheadInput.focus();
        }
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        this.isSearchActive = false;
        if (event.item) {
            this.selectDatasetEmitter.emit(
                event.item as DatasetAutocompleteItem,
            );
            setTimeout(() => {
                const typeaheadInput: HTMLElement | null =
                    document.getElementById("typeahead-http");
                if (typeaheadInput) {
                    typeaheadInput.blur();
                }
            });
        }
    }

    public toggleAppHeaderMenu(): void {
        const appHeaderButton: HTMLElement | null =
            document.getElementById("app-header");

        this.isCollapsedAppHeaderMenu = !this.isCollapsedAppHeaderMenu;
        if (appHeaderButton) {
            if (this.isCollapsedAppHeaderMenu) {
                appHeaderButton.classList.add("Details--on");
            } else {
                appHeaderButton.classList.remove("Details--on");
            }
        }
    }

    public onFocus(event: Event): void {
        this.isSearchActive = true;
        event.stopPropagation();
        setTimeout(() => {
            const inputEvent: Event = new Event("input");
            (event.target as HTMLElement).dispatchEvent(inputEvent);
        }, 0);
    }

    public onSearch(event: Event): void {
        this.isSearchActive = false;
        setTimeout(() => {
            if (this.isMobileView) {
                this.triggerMenuClick();
            }
            (event.target as HTMLElement).blur();
        }, AppValues.SHORT_DELAY_MS);
        if (!this.searchQuery) {
            this.navigationService.navigateToHome();
            return;
        }
        this.navigationService.navigateToSearch(this.searchQuery);
    }

    public onLogin(): void {
        this.loginEmitter.emit();
    }

    public onLogOut(): void {
        this.logOutEmitter.emit();
    }

    public onAddNew(): void {
        this.addNewEmitter.emit();
    }

    public onOpenUserInfo(): void {
        this.userProfileEmitter.emit();
    }

    public triggerMenuClick(): void {
        const el: HTMLElement = this.appHeaderMenuButton.nativeElement;
        el.focus();
        el.click();
        el.blur();
        this.isCollapsedAppHeaderMenu = !this.isCollapsedAppHeaderMenu;
    }

    public onClickAppLogo(): void {
        this.clickAppLogoEmitter.emit();
    }

    public onHelp(): void {
        this.clickHelpEmitter.emit();
    }

    public onSettings(): void {
        this.clickSettingsEmitter.emit();
    }

    public onAnalytics(): void {
        this.clickAnalyticsEmitter.emit();
    }

    public onBilling(): void {
        this.clickBillingEmitter.emit();
    }

    public onUserDatasets(): void {
        this.clickUserDatasetsEmitter.emit();
    }

    public onUserProfile(): void {
        this.clickUserProfileEmitter.emit();
    }
}
