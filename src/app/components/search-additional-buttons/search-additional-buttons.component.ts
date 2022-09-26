import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { SearchAdditionalHeaderButtonInterface } from "./search-additional-buttons.interface";
import { MatSidenav } from "@angular/material/sidenav";
import AppValues from "../../common/app.values";
import { logError } from "src/app/common/app.helpers";
import { SideNavHelper } from "src/app/common/sidenav.helper";

@Component({
    selector: "app-search-additional-buttons",
    templateUrl: "./search-additional-buttons.component.html",
    styleUrls: ["./search-additional-buttons.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAdditionalButtonsComponent implements OnInit {
    @Input()
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<string>();
    public isMinimizeSearchAdditionalButtons = false;
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: ElementRef;
    private sideNavHelper: SideNavHelper;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sideNavHelper.close().catch((e) => logError(e));
        } else {
            this.sideNavHelper.open().catch((e) => logError(e));
        }
    }

    public ngOnInit(): void {
        if (this.sidenav) {
            this.sideNavHelper = new SideNavHelper(this.sidenav);
            this.checkWindowSize();
        }
    }

    public onClick(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}
