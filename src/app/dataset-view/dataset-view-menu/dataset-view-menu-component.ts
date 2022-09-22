import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import {
    DatasetNavigationInterface,
    DatasetViewTypeEnum,
} from "../dataset-view.interface";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "../../common/app.values";
import { SideNavService } from "../../services/sidenav.service";
import { logError } from "src/app/common/app.helpers";

@Component({
    selector: "app-dataset-view-menu",
    templateUrl: "./dataset-view-menu.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewMenuComponent implements OnInit {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: ElementRef;

    @Input() datasetNavigation: DatasetNavigationInterface;
    @Input() datasetViewType: DatasetViewTypeEnum;
    @Input() isMinimizeSearchAdditionalButtons: boolean;

    public clipboardKamuCli = AppValues.clipboardKamuCli;
    public clipboardKafka = AppValues.clipboardKafka;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sidenavService.close().catch((e) => logError(e));
        } else {
            this.sidenavService.open().catch((e) => logError(e));
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

        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement =
                event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = "inline-block";
                currentElementChildren[1].style.display = "none";
                currentElement.classList.remove("clipboard-btn--success");
            }, 2000);

            currentElementChildren[0].style.display = "none";
            currentElementChildren[1].style.display = "inline-block";
            currentElement.classList.add("clipboard-btn--success");
        }
    }

    public get isDatasetViewTypeOverview(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Overview;
    }

    public get isDatasetViewTypeData(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Data;
    }

    public get isDatasetViewTypeMetadata(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Metadata;
    }

    public get isDatasetViewTypeHistory(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.History;
    }

    public get isDatasetViewTypeLineage(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Lineage;
    }

    public get isDatasetViewTypeDiscussions(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Discussions;
    }

    public onNavigateToOverview(): void {
        this.datasetNavigation.navigateToOverview();
    }

    public onNavigateToData(): void {
        this.datasetNavigation.navigateToData();
    }

    public onNavigateToMetadata(): void {
        this.datasetNavigation.navigateToMetadata(1);
    }

    public onNavigateToHistory(): void {
        this.datasetNavigation.navigateToHistory(1);
    }

    public onNavigateToLineage(): void {
        this.datasetNavigation.navigateToLineage();
    }

    public onNavigateToDiscussions(): void {
        this.datasetNavigation.navigateToDiscussions();
    }
}
