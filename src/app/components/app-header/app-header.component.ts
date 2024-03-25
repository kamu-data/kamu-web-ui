import { MaybeNull } from "../../common/app.types";
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from "@angular/router";
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
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from "rxjs/operators";
import { DatasetAutocompleteItem, TypeNames } from "../../interface/search.interface";
import { SearchApi } from "../../api/search.api";
import AppValues from "../../common/app.values";
import { BaseComponent } from "src/app/common/base.component";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { AppConfigFeatureFlags, LoginMethod } from "src/app/app-config.model";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
    styleUrls: ["./app-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent extends BaseComponent implements OnInit {
    public readonly APP_LOGO = AppValues.APP_LOGO;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    @Input() public isMobileView: boolean;
    @Input() public isVisible: boolean;
    @Input() public loggedAccount: AccountFragment;
    @Input() public featureFlags: AppConfigFeatureFlags;
    @Input() public loginMethods: LoginMethod[];

    @Output() public onSelectedDataset = new EventEmitter<DatasetAutocompleteItem>();
    @Output() public onClickedAddNew = new EventEmitter<null>();
    @Output() public onClickedLogin = new EventEmitter<null>();
    @Output() public onClickedLogout = new EventEmitter<null>();
    @Output() public onClickedOpenUserInfo = new EventEmitter<null>();
    @Output() public onClickedAppLogo = new EventEmitter<null>();
    @Output() public onClickedSettings = new EventEmitter<null>();
    @Output() public onClickedHelp = new EventEmitter<null>();
    @Output() public onClickedAnalytics = new EventEmitter<null>();
    @Output() public onClickedBilling = new EventEmitter<null>();
    @Output() public onClickedUserDatasets = new EventEmitter<null>();
    @Output() public onClickedUserProfile = new EventEmitter<null>();
    @Output() public onClickedDashboard = new EventEmitter<null>();

    @ViewChild("appHeaderMenuButton")
    private appHeaderMenuButton: ElementRef<HTMLElement>;

    public readonly DEFAULT_USER_DISPLAY_NAME: string = AppValues.DEFAULT_USER_DISPLAY_NAME;

    public isSearchActive = false;
    public isCollapsedAppHeaderMenu = false;
    public searchQuery = "";
    public searching = false;

    public constructor(
        private appSearchAPI: SearchApi,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private navigationService: NavigationService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe((event: RouterEvent) => {
                    if (!event.url.includes(`?${ProjectLinks.URL_QUERY_PARAM_QUERY}=`)) {
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

    public isDatasetType(type: TypeNames): boolean {
        return type === TypeNames.datasetType;
    }

    public isUserLoggedIn(): boolean {
        return this.loggedAccount.accountName.length > 0;
    }

    public get isAdmin(): boolean {
        return this.loggedAccount.isAdmin;
    }

    public search: OperatorFunction<string, readonly DatasetAutocompleteItem[]> = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(AppValues.SHORT_DELAY_MS),
            distinctUntilChanged(),
            tap(() => (this.searching = true)),
            switchMap((term: string) => this.appSearchAPI.autocompleteDatasetSearch(term)),
            tap(() => {
                this.searching = false;
            }),
        );
    };

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? x.dataset.name : x;
    }

    public onClickInput(): void {
        const typeaheadInput: MaybeNull<HTMLElement> = document.getElementById("typeahead-http");
        if (typeaheadInput) {
            typeaheadInput.focus();
        }
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        this.isSearchActive = false;
        if (event.item) {
            this.onSelectedDataset.emit(event.item as DatasetAutocompleteItem);
            setTimeout(() => {
                const typeaheadInput: MaybeNull<HTMLElement> = document.getElementById("typeahead-http");
                if (typeaheadInput) {
                    typeaheadInput.blur();
                }
            });
        }
    }

    public toggleAppHeaderMenu(): void {
        const appHeaderButton: MaybeNull<HTMLElement> = document.getElementById("app-header");

        this.isCollapsedAppHeaderMenu = !this.isCollapsedAppHeaderMenu;
        if (appHeaderButton) {
            if (this.isCollapsedAppHeaderMenu) {
                appHeaderButton.classList.add("details--on");
            } else {
                appHeaderButton.classList.remove("details--on");
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
        this.onClickedLogin.emit();
    }

    public onLogout(): void {
        this.onClickedLogout.emit();
    }

    public onAddNew(): void {
        this.onClickedAddNew.emit();
    }

    public onOpenUserInfo(): void {
        this.onClickedOpenUserInfo.emit();
    }

    public triggerMenuClick(): void {
        const el: HTMLElement = this.appHeaderMenuButton.nativeElement;
        el.focus();
        el.click();
        el.blur();
        this.isCollapsedAppHeaderMenu = !this.isCollapsedAppHeaderMenu;
    }

    public onAppLogo(): void {
        this.onClickedAppLogo.emit();
    }

    public onHelp(): void {
        this.onClickedHelp.emit();
    }

    public onSettings(): void {
        this.onClickedSettings.emit();
    }

    public onAnalytics(): void {
        this.onClickedAnalytics.emit();
    }

    public onBilling(): void {
        this.onClickedBilling.emit();
    }

    public onUserDatasets(): void {
        this.onClickedUserDatasets.emit();
    }

    public onUserProfile(): void {
        this.onClickedUserProfile.emit();
    }

    public onDashboard(): void {
        this.onClickedDashboard.emit();
    }
}
