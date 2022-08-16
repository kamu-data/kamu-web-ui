import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { DatasetNameInterface } from "../../interface/search.interface";
import { SearchAdditionalHeaderButtonInterface } from "../../components/search-additional-buttons/search-additional-buttons.interface";
import { searchAdditionalButtonsEnum } from "../../search/search.interface";
import { MatSidenav } from "@angular/material/sidenav";
import AppValues from "../../common/app.values";
import { SideNavService } from "../../services/sidenav.service";

@Component({
    selector: "app-dataset-view-header",
    templateUrl: "./dataset-view-header.html",
})
export class DatasetViewHeaderComponent implements OnInit {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: any;

    @Input() datasetName: DatasetNameInterface;
    @Output() public showOwnerPageEmit: EventEmitter<null> = new EventEmitter();
    @Output() public onClickSearchAdditionalButtonEmit: EventEmitter<string> =
        new EventEmitter();

    public isMinimizeSearchAdditionalButtons = false;
    public isMobileView = false;
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[] =
        [
            {
                textButton: searchAdditionalButtonsEnum.Starred,
                counter: 2,
                iconSvgPath:
                    // tslint:disable-next-line:max-line-length
                    "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z",
                svgClass:
                    "octicon octicon-star-fill starred-button-icon d-inline-block mr-2",
                iconSvgPathClass: "starred-button-icon",
            },
            {
                textButton: searchAdditionalButtonsEnum.UnWatch,
                counter: 1,
                iconSvgPath:
                    // tslint:disable-next-line:max-line-length
                    "M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z",
                svgClass: "octicon octicon-eye mr-2",
                iconSvgPathClass: "",
                additionalOptions: {
                    title: "Notifications",
                    options: [
                        {
                            title: "Participating and @mentions",
                            text: "Only receive notifications from this repository when participating or @mentioned.",
                            value: "participating",
                        },
                        {
                            title: "All Activity",
                            text: "Notified of all notifications on this repository.",
                            value: "all",
                            isSelected: true,
                        },
                        {
                            title: "Ignore",
                            text: "Never be notified.",
                            value: "ignore",
                        },
                    ],
                },
            },
            {
                textButton: searchAdditionalButtonsEnum.DeriveFrom,
                counter: 4,
                iconSvgPath:
                    // tslint:disable-next-line:max-line-length
                    "M13,9v2h-2.488c-0.047-0.006-0.131-0.044-0.169-0.069L7.416,8l2.931-2.931C10.384,5.041,10.469,5.006,10.516,5H13v2l3-3 l-3-3v2h-2.5C9.962,3,9.319,3.266,8.941,3.647L6.584,6H0v4h6.584l2.353,2.353C9.319,12.734,9.959,13,10.497,13h2.5v2l3-3L13,9z",
                svgClass: "octicon octicon-x mr-2",
                iconSvgPathClass: "",
            },
        ];

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();
        this.isMobileView = AppValues.isMobileView();

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

    public showOwnerPage(): void {
        this.showOwnerPageEmit.emit();
    }
    public onClickSearchAdditionalButton(method: string): void {
        this.onClickSearchAdditionalButtonEmit.emit(method);
    }
}
