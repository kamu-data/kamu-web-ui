import { WidgetHeightService } from "../../services/widget-height.service";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { SideNavHelper } from "../../common/sidenav.helper";
import { isMobileView, promiseWithCatch } from "src/app/common/app.helpers";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetPermissionsService } from "../dataset.permissions.service";

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

    @Input({ required: true }) datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) datasetPermissions: DatasetPermissionsFragment;
    @Input({ required: true }) datasetViewType: DatasetViewTypeEnum;
    @Input() isMinimizeSearchAdditionalButtons: boolean;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private sideNavHelper: SideNavHelper;

    private datasetPermissionsServices = inject(DatasetPermissionsService);
    private widgetHeightService = inject(WidgetHeightService);

    public ngAfterViewInit(): void {
        this.widgetHeightService.setWidgetOffsetTop(
            this.datasetViewMenuComponent.nativeElement.clientHeight +
                this.datasetViewMenuComponent.nativeElement.offsetTop,
        );
    }

    public ngOnInit(): void {
        if (this.sidenav) {
            this.sideNavHelper = new SideNavHelper(this.sidenav);
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

    public get isDatasetViewTypeFlows(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Flows;
    }

    public get isDatasetViewTypeSettings(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Settings;
    }

    public get shouldAllowSettingsTab(): boolean {
        return this.datasetPermissionsServices.shouldAllowSettingsTab(this.datasetPermissions);
    }

    public get datasetLink(): string {
        return `/${this.datasetBasics.owner.accountName}/${this.datasetBasics.name}/`;
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
        if (this.datasetViewMenuComponent.nativeElement.offsetHeight)
            this.widgetHeightService.setWidgetOffsetTop(
                this.datasetViewMenuComponent.nativeElement.offsetHeight +
                    this.datasetViewMenuComponent.nativeElement.offsetTop,
            );
    }
}
