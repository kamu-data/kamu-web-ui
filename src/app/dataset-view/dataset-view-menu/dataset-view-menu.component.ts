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
import { ElementsViewService, ElementVisibilityMode } from "src/app/services/elements-view.service";
import { Observable } from "rxjs";
import { DatasetMenuItemOptions, DatasetViewMenuItems } from "./dataset-view-menu.model";

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
    public datasetMenuItemDescriptors: DatasetMenuItemOptions[] = DatasetViewMenuItems;
    private sideNavHelper: SideNavHelper;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private elementsViewService = inject(ElementsViewService);
    private widgetHeightService = inject(WidgetHeightService);
    public viewModeElement$: Observable<ElementVisibilityMode>;

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
        this.viewModeElement$ = this.elementsViewService.viewModeElement();
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
