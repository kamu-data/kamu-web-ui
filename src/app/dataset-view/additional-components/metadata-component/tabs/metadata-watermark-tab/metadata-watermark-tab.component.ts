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
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EditWatermarkModalComponent } from "../../../overview-component/components/edit-watermark-modal/edit-watermark-modal.component";
import { from, take } from "rxjs";
import { MetadataTabs } from "../../metadata.constants";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";

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
    ],
    templateUrl: "./metadata-watermark-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataWatermarkTabComponent {
    @Input(RoutingResolvers.METADATA_WATERMARK_TAB_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private ngbModalService = inject(NgbModal);
    private navigationService = inject(NavigationService);

    public get watermark(): MaybeNullOrUndefined<string> {
        return this.datasetMetadataTabData.overviewUpdate.overview.metadata.currentWatermark;
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.datasetMetadataTabData.datasetBasics;
    }

    public get canEditWatermark(): boolean {
        return this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
    }

    public onEditWatermark(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditWatermarkModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditWatermarkModalComponent;
        modalRefInstance.currentWatermark = this.watermark;
        modalRefInstance.datasetBasics = this.datasetMetadataTabData.datasetBasics;
        from(modalRef.result)
            .pipe(take(1))
            .subscribe(() => {
                this.navigationService.navigateToMetadata(
                    { accountName: this.datasetBasics.owner.accountName, datasetName: this.datasetBasics.name },
                    MetadataTabs.Watermark,
                );
            });
    }
}
