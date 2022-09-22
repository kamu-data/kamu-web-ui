import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from "@angular/core";
import { Observable, OperatorFunction } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "../../interface/search.interface";
import { SearchApi } from "../../api/search.api";
import AppValues from "../../common/app.values";
import { BaseComponent } from "src/app/common/base.component";
import { AccountInfo } from "src/app/api/kamu.graphql.interface";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent extends BaseComponent {
    @Input() public searchValue: string;
    @Input() public appLogo: string;
    @Input() public isMobileView: boolean;
    @Input() public isVisible: boolean;
    @Input() public userInfo: AccountInfo;

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

    public defaultUsername: string = AppValues.defaultUsername;
    public isSearchActive = false;
    public isCollapsedAppHeaderMenu = false;

    constructor(private appSearchAPI: SearchApi) {
        super();
    }

    public isDatasetType(type: string): boolean {
        return type === TypeNames.datasetType;
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

    public onSearch(event: Event): void {
        this.isSearchActive = false;

        setTimeout(() => {
            if (this.isMobileView) {
                this.triggerMenuClick();
            }

            (event.target as HTMLElement).blur();
            const typeaheadInput: Element | null = document.querySelector(
                "ngb-typeahead-window",
            );
            if (typeaheadInput) {
                typeaheadInput.classList.remove("show");
            }
        }, 200);
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
