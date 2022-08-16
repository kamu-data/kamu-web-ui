import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "../../common/app.values";
import { SideNavService } from "../../services/sidenav.service";

@Component({
    selector: "app-dataset-view-menu",
    templateUrl: "./dataset-view-menu.html",
})
export class DatasetViewMenuComponent implements OnInit {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: any;

    @Input() parentShareMethods!: any;
    @Input() datasetViewType: DatasetViewTypeEnum;
    @Input() isMinimizeSearchAdditionalButtons: boolean;

    public clipboardKamuCli = "kamu pull kamu.dev/anonymous/dataset";
    public clipboardKafka = "https://api.kamu.dev/kafka/anonymous/dataset";

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sidenavService.close();
        } else {
            this.sidenavService.open();
        }
    }

    constructor(
        private clipboard: Clipboard,
        private sidenavService: SideNavService,
    ) {}

    public ngOnInit(): void {
        this.checkWindowSize();
        if (this.sidenav) {
            this.sidenavService.setSidenav(this.sidenav);
        }
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);

        const currentEvent: EventTarget | null = event.currentTarget;

        if (currentEvent !== null) {
            setTimeout(() => {
                // @ts-ignore
                // tslint:disable-next-line:no-string-literal
                currentEvent["children"][0].style.display = "inline-block";
                // @ts-ignore
                // tslint:disable-next-line:no-string-literal
                currentEvent["children"][1].style.display = "none";
                // @ts-ignore
                // tslint:disable-next-line:no-string-literal
                currentEvent["classList"].remove("clipboard-btn--success");
            }, 2000);

            // @ts-ignore
            // tslint:disable-next-line:no-string-literal
            currentEvent["children"][0].style.display = "none";
            // @ts-ignore
            // tslint:disable-next-line:no-string-literal
            currentEvent["children"][1].style.display = "inline-block";
            // @ts-ignore
            // tslint:disable-next-line:no-string-literal
            currentEvent["classList"].add("clipboard-btn--success");
        }
    }

    public get isDatasetViewTypeOverview(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.overview;
    }

    public get isDatasetViewTypeData(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.data;
    }

    public get isDatasetViewTypeMetadata(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.metadata;
    }

    public get isDatasetViewTypeHistory(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.history;
    }

    public get isDatasetViewTypeLinage(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.linage;
    }

    public get isDatasetViewTypeDiscussions(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.discussions;
    }

    public onSearchDataset(): void {
        this.parentShareMethods.onSearchDataset();
    }

    public onSearchDataForDataset(): void {
        this.parentShareMethods.onSearchDataForDataset();
    }

    public onSearchMetadata(currentPage: number): void {
        this.parentShareMethods.onSearchMetadata(currentPage);
    }

    public onSearchDataForHistory(currentPage: number): void {
        this.parentShareMethods.onSearchDataForHistory(currentPage);
    }

    public onSearchLinageDataset(): void {
        this.parentShareMethods.onSearchLinageDataset();
    }

    public onSearchDiscussions(): void {
        this.parentShareMethods.onSearchDiscussions();
    }
}
