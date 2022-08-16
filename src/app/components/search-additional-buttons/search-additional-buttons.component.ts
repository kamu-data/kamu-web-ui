import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import {
    SearchAdditionalButtonInterface,
    SearchAdditionalHeaderButtonInterface,
} from "./search-additional-buttons.interface";
import { MatSidenav } from "@angular/material/sidenav";
import AppValues from "../../common/app.values";
import { SideNavService } from "../../services/sidenav.service";

@Component({
    selector: "app-search-additional-buttons",
    templateUrl: "./search-additional-buttons.component.html",
    styleUrls: ["./search-additional-buttons.component.sass"],
})
export class SearchAdditionalButtonsComponent implements OnInit {
    @Input()
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Output() public searchAdditionalButtonsMethod: EventEmitter<string> =
        new EventEmitter();
    public isMinimizeSearchAdditionalButtons = false;
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: any;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sidenavService.close();
        } else {
            this.sidenavService.open();
        }
    }

    constructor(private sidenavService: SideNavService) {}

    public ngOnInit(): void {
        this.checkWindowSize();
        if (this.sidenav) {
            this.sidenavService.setSidenav(this.sidenav);
        }
    }

    public onClick(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}
