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
import AppValues from "../../common/app.values";
import { BaseComponent } from "src/app/common/base.component";
import { AccountInfo } from "src/app/api/kamu.graphql.interface";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-header",
    templateUrl: "./app-header.component.html",
})
export class AppHeaderComponent extends BaseComponent {
    @Input() public searchValue: string;
    @Input() public appLogo: string;
    @Input() public isMobileView: boolean;
    @Input() public isVisible: boolean;
    @Input() public userInfo: AccountInfo;

    @Output() public selectDatasetEmitter: EventEmitter<DatasetIDsInterface> =
        new EventEmitter();
    @Output() public addNewEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public loginEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public logOutEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public userProfileEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public clickAppLogoEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public clickSettingsEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public clickHelpEmitter: EventEmitter<null> = new EventEmitter();
    @Output() public clickAnalyticsEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public clickBillingEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public clickUserDatasetsEmitter: EventEmitter<null> =
        new EventEmitter();
    @Output() public clickUserProfileEmitter: EventEmitter<null> =
        new EventEmitter();

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

    public search: OperatorFunction<string, readonly DatasetIDsInterface[]> = (
        text$: Observable<string>,
    ) => {
        return text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) =>
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
    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
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
