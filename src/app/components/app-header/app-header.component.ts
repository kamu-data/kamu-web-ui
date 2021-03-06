import {
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
    DatasetIDsInterface,
    TypeNames,
} from "../../interface/search.interface";
import { SearchApi } from "../../api/search.api";
import { UserInterface } from "../../interface/auth.interface";
import AppValues from "../../common/app.values";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
})
export class AppHeaderComponent {
    @Input() public searchValue: DatasetIDsInterface = {
        id: "",
        name: "",
        __typename: TypeNames.allDataType,
    };
    @Input() public appLogo: string;
    @Input() public isMobileView: boolean;
    @Input() public isVisible: boolean;
    @Input() public userInfo: UserInterface;

    @Output() public selectDatasetEmitter: EventEmitter<DatasetIDsInterface> =
        new EventEmitter();
    @Output() public addNewEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public loginEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public logOutEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public userProfileEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickAppLogoEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickSettingsEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickHelpEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickAnalyticsEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickBillingEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickUserDatasetsEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public onClickUserProfileEmitter: EventEmitter<null> =
        new EventEmitter();

    @ViewChild("appHeaderMenuButton")
    appHeaderMenuButton: ElementRef<HTMLElement>;

    private _window: Window;

    public defaultUsername: string = AppValues.defaultUsername;
    public isSearchActive = false;
    public isCollapsedAppHeaderMenu: boolean = false;

    constructor(private appSearchAPI: SearchApi) {
        this._window = window;
    }

    public isDatasetType(type: string): boolean {
        return type === TypeNames.datasetType;
    }
    public search: OperatorFunction<string, readonly DatasetIDsInterface[]> = (
        text$: Observable<string>,
    ) => {
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term) =>
                this.appSearchAPI.autocompleteDatasetSearch(term),
            ),
        );
    };

    public formatter(x: DatasetIDsInterface | string): string {
        return typeof x !== "string" ? x.name : x;
    }

    public onClickInput(): void {
        const typeaheadInput: HTMLElement | null =
            document.getElementById("typeahead-http");
        if (typeaheadInput) {
            typeaheadInput.focus();
        }
    }
    public onSelectItem(event: any): void {
        this.isSearchActive = false;

        if (event.item) {
            this.selectDatasetEmitter.emit(event.item);

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

    public onSearch(
        event: any,
        searchValue: DatasetIDsInterface | string,
    ): void {
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document
                    .querySelector("ngb-typeahead-window")
                    .classList.remove("show");
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
        this.onClickAppLogoEmitter.emit();
    }
    public onHelp(): void {
        this.onClickHelpEmitter.emit();
    }

    public onSettings(): void {
        this.onClickSettingsEmitter.emit();
    }

    public onAnalytics(): void {
        this.onClickAnalyticsEmitter.emit();
    }
    public onBilling(): void {
        this.onClickBillingEmitter.emit();
    }

    public onUserDatasets(): void {
        this.onClickUserDatasetsEmitter.emit();
    }

    public onUserProfile(): void {
        this.onClickUserProfileEmitter.emit();
    }
}
