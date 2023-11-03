import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DatasetNavigationInterface, DatasetViewTypeEnum } from "../dataset-view.interface";
import { Clipboard } from "@angular/cdk/clipboard";
import AppValues from "../../common/app.values";
import { SideNavHelper } from "../../common/sidenav.helper";
import { isMobileView, promiseWithCatch } from "src/app/common/app.helpers";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetPermissionsService } from "../dataset.permissions.service";
import { LineageGraphHeigthService } from "src/app/components/lineage-graph/lineage-graph-heigth.service";

@Component({
    selector: "app-dataset-view-menu",
    templateUrl: "./dataset-view-menu.component.html",
    styleUrls: ["./dataset-view-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewMenuComponent implements OnInit, AfterViewInit {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: ElementRef;
    @ViewChild("datasetViewMenu") datasetViewMenuComponent: ElementRef<HTMLDivElement>;

    @Input() datasetBasics: DatasetBasicsFragment;
    @Input() datasetPermissions: DatasetPermissionsFragment;
    @Input() datasetNavigation: DatasetNavigationInterface;
    @Input() datasetViewType: DatasetViewTypeEnum;
    @Input() isMinimizeSearchAdditionalButtons: boolean;

    public clipboardKamuCli = "";
    public clipboardKafka = "";

    private sideNavHelper: SideNavHelper;

    constructor(
        private clipboard: Clipboard,
        private datasetPermissionsServices: DatasetPermissionsService,
        private lineageGraphHeigthService: LineageGraphHeigthService,
    ) {}
    ngAfterViewInit(): void {
        this.lineageGraphHeigthService.setDatasetViewMenuHeight(
            this.datasetViewMenuComponent.nativeElement.offsetHeight,
        );
    }

    public ngOnInit(): void {
        if (this.sidenav) {
            this.sideNavHelper = new SideNavHelper(this.sidenav);
        }
        this.checkWindowSize();
        this.initClipboardHints();
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);

        if (event.currentTarget !== null) {
            const currentElement: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
            const currentElementChildren: HTMLCollectionOf<HTMLElement> =
                currentElement.children as HTMLCollectionOf<HTMLElement>;
            setTimeout(() => {
                currentElementChildren[0].style.display = "inline-block";
                currentElementChildren[1].style.display = "none";
                currentElement.classList.remove("clipboard-btn--success");
            }, AppValues.LONG_DELAY_MS);

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

    public get isDatasetViewTypeSettings(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Settings;
    }

    public get shouldAllowSettingsTab(): boolean {
        return this.datasetPermissionsServices.shouldAllowSettingsTab(this.datasetPermissions);
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

    public onNavigateToSettings(): void {
        if (this.shouldAllowSettingsTab) {
            this.datasetNavigation.navigateToSettings();
        }
    }

    @HostListener("window:resize")
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = isMobileView();
        if (this.sidenav) {
            if (isMobileView()) {
                promiseWithCatch(this.sideNavHelper.close());
            } else {
                promiseWithCatch(this.sideNavHelper.open());
            }
        }
    }

    private initClipboardHints(): void {
        this.clipboardKamuCli = `kamu pull kamu.dev/${this.datasetBasics.alias}`;
        this.clipboardKafka = `https://api.kamu.dev/kafka/${this.datasetBasics.alias}`;
    }
}
