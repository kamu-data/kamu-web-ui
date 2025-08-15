/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgIf } from "@angular/common";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { DisplayTimeComponent } from "src/app/common/components/display-time/display-time.component";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { isNil } from "src/app/common/helpers/app.helpers";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EditWatermarkModalComponent } from "../../../overview-component/components/edit-watermark-modal/edit-watermark-modal.component";

@Component({
    selector: "app-metadata-watermark-tab",
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
        DisplayTimeComponent,
        FeatureFlagDirective,
    ],
    templateUrl: "./metadata-watermark-tab.component.html",
    styleUrls: ["./metadata-watermark-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataWatermarkTabComponent {
    @Input(RoutingResolvers.METADATA_WATERMARK_TAB_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private ngbModalService = inject(NgbModal);

    public get watermark(): MaybeNullOrUndefined<string> {
        return this.datasetMetadataTabData.overviewUpdate.overview.metadata.currentWatermark;
    }

    public get canEditWatermark(): boolean {
        return !isNil(this.watermark) && this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
    }

    public onEditWatermark(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditWatermarkModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditWatermarkModalComponent;
        modalRefInstance.currentWatermark = this.watermark;
        modalRefInstance.datasetBasics = this.datasetMetadataTabData.datasetBasics;
    }
}
