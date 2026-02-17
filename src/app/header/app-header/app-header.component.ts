/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent, RouterLink } from "@angular/router";

import { Observable, OperatorFunction } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, take, tap } from "rxjs/operators";

import { AccountFragment, AccountProvider } from "@api/kamu.graphql.interface";
import { SearchApi } from "@api/search.api";
import { BaseComponent } from "@common/components/base.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { DisplayAccountNamePipe } from "@common/pipes/display-account-name.pipe";
import AppValues from "@common/values/app.values";
import { NgbHighlight, NgbTypeahead, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { AppUIConfigFeatureFlags } from "src/app/app-config.model";
import { NotificationIndicatorComponent } from "src/app/header/notification-indicator/notification-indicator.component";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
    styleUrls: ["./app-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        RouterLink,
        MatProgressSpinnerModule,
        NgbTypeahead,
        FormsModule,
        NgbHighlight,
        MatIconModule,
        FeatureFlagDirective,
        NotificationIndicatorComponent,
        MatMenuModule,
        DisplayAccountNamePipe,
    ],
})
export class AppHeaderComponent extends BaseComponent implements OnInit {
    public readonly APP_LOGO = AppValues.APP_LOGO;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    @Input({ required: true }) public isMobileView: boolean;
    @Input({ required: true }) public isVisible: boolean;
    @Input({ required: true }) public loggedAccount: AccountFragment;
    @Input({ required: true }) public featureFlags: AppUIConfigFeatureFlags;
    @Input({ required: true }) public loginMethods: AccountProvider[];

    @Output() public onSelectedDataset = new EventEmitter<DatasetAutocompleteItem>();
    @Output() public onClickedAddNew = new EventEmitter<null>();
    @Output() public onClickedLogin = new EventEmitter<null>();
    @Output() public onClickedLogout = new EventEmitter<null>();
    @Output() public onClickedOpenUserInfo = new EventEmitter<null>();
    @Output() public onClickedHelp = new EventEmitter<null>();
    @Output() public onClickedAnalytics = new EventEmitter<null>();
    @Output() public onClickedBilling = new EventEmitter<null>();
    @Output() public onClickedDashboard = new EventEmitter<null>();

    @ViewChild("appHeaderMenuButton")
    private appHeaderMenuButton: ElementRef<HTMLElement>;

    public readonly DEFAULT_USER_DISPLAY_NAME: string = AppValues.DEFAULT_USER_DISPLAY_NAME;
    public readonly AccountTabs: typeof AccountTabs = AccountTabs;
    public readonly AccountSettingsTabs: typeof AccountSettingsTabs = AccountSettingsTabs;

    public isSearchActive = false;
    public isCollapsedAppHeaderMenu = false;
    public searchQuery = "";
    public searching = false;
    public readonly HOME_LINK = ProjectLinks.URL_SEARCH;
    public readonly URL_DATASET_CREATE = ProjectLinks.URL_DATASET_CREATE;
    public readonly URL_SETTINGS = ProjectLinks.URL_SETTINGS;
    public readonly URL_QUERY = ProjectLinks.URL_QUERY;
    public readonly URL_ACCOUNT_SELECT = ProjectLinks.URL_ACCOUNT_SELECT;
    public readonly TypeNames: typeof TypeNames = TypeNames;

    private appSearchAPI = inject(SearchApi);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private navigationService = inject(NavigationService);
    private sessionStorageService = inject(SessionStorageService);

    public ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event) => event as RouterEvent),
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: RouterEvent) => {
                const urlObj = new URL(event.url, window.location.origin);
                this.searchQuery = (urlObj.searchParams.get(ProjectLinks.URL_QUERY_PARAM_QUERY) as string) ?? "";
                this.cdr.detectChanges();
            });
        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((param: Params) => {
            if (param.query) {
                this.searchQuery = param.query as string;
            }
        });
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

    public get isWeb3Wallet(): boolean {
        return this.loggedAccount.accountProvider === AccountProvider.Web3Wallet;
    }

    public search: OperatorFunction<string, readonly DatasetAutocompleteItem[]> = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(AppValues.SHORT_DELAY_MS),
            distinctUntilChanged(),
            tap(() => (this.searching = true)),
            switchMap((term: string) =>
                this.appSearchAPI.autocompleteDatasetSearch(term).pipe(
                    take(1),
                    finalize(() => {
                        this.searching = false;
                        this.cdr.detectChanges();
                    }),
                ),
            ),
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
            this.sessionStorageService.removeDatasetSqlCode();
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
        this.sessionStorageService.removeDatasetSqlCode();
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

    public onHelp(): void {
        this.onClickedHelp.emit();
    }

    public onAnalytics(): void {
        this.onClickedAnalytics.emit();
    }

    public onBilling(): void {
        this.onClickedBilling.emit();
    }

    public onDashboard(): void {
        this.onClickedDashboard.emit();
    }
}
