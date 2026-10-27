/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenav } from "@angular/material/sidenav";
import { RouterLink } from "@angular/router";

import { WidgetHeightService } from "@common/components/lineage-graph/widget-height.service";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { isMobileView, promiseWithCatch } from "@common/helpers/app.helpers";
import { SideNavHelper } from "@common/helpers/sidenav.helper";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-dataset-view-menu",
    templateUrl: "./dataset-view-menu.component.html",
    styleUrls: ["./dataset-view-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        RouterLink,
        //-----//
        MatButtonToggleModule,
        MatIconModule,
        //-----//
        FeatureFlagDirective,
        DatasetLinkPipe,
    ],
})
export class DatasetViewMenuComponent implements OnInit {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("datasetViewMenu") public datasetViewMenuComponent: ElementRef<HTMLDivElement>;

    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;
    @Input({ required: true }) public datasetViewType: DatasetViewTypeEnum;
    @Input() public isMinimizeSearchAdditionalButtons: boolean;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private sideNavHelper: SideNavHelper;

    private widgetHeightService = inject(WidgetHeightService);
    private configService = inject(AppConfigService);

    public constructor() {
        afterNextRender({
            read: () => {
                this.widgetHeightService.setWidgetOffsetTop(
                    this.datasetViewMenuComponent.nativeElement.clientHeight +
                        this.datasetViewMenuComponent.nativeElement.offsetTop,
                );
            },
        });
    }

    public ngOnInit(): void {
        if (this.sidenav) {
            this.sideNavHelper = new SideNavHelper(this.sidenav);
        }
    }

    public get enableScheduling(): boolean {
        return this.configService.featureFlags.enableScheduling;
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
        return this.datasetPermissions.permissions.envVars.canView;
    }

    public get shouldAllowFlowsTab(): boolean {
        return this.datasetPermissions.permissions.flows.canView && this.enableScheduling;
    }

    @HostListener("window:resize")
    public checkWindowSize(): void {
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
