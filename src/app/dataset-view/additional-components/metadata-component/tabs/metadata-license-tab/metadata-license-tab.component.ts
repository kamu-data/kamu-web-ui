/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgIf } from "@angular/common";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { LicenseFragment } from "src/app/api/kamu.graphql.interface";
import { LinkPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/link-property/link-property.component";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { isNil } from "src/app/common/helpers/app.helpers";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EditLicenseModalComponent } from "../../../overview-component/components/edit-license-modal/edit-license-modal.component";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";

@Component({
    selector: "app-metadata-license-tab",
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
        FeatureFlagDirective,
        LinkPropertyComponent,
    ],
    templateUrl: "./metadata-license-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataLicenseTabComponent {
    @Input(RoutingResolvers.METADATA_LICENSE_TAB_KEY) public license: MaybeNullOrUndefined<LicenseFragment>;
    @Input(RoutingResolvers.DATASET_VIEW_METADATA_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private ngbModalService = inject(NgbModal);

    public get canEditLicense(): boolean {
        return !isNil(this.license) && this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
    }

    public onEditLicense(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditLicenseModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditLicenseModalComponent;
        modalRefInstance.currentState = {
            schema: this.datasetMetadataTabData.overviewUpdate.schema,
            data: this.datasetMetadataTabData.overviewUpdate.content,
            overview: this.datasetMetadataTabData.overviewUpdate.overview,
            size: this.datasetMetadataTabData.overviewUpdate.size,
        };
        modalRefInstance.datasetBasics = this.datasetMetadataTabData.datasetBasics;
    }
}
