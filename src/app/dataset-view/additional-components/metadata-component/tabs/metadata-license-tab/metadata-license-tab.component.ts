/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { catchError, from, of, take } from "rxjs";

import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment, LicenseFragment } from "src/app/api/kamu.graphql.interface";
import { LinkPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/link-property/link-property.component";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";

import { EditLicenseModalComponent } from "../../../overview-component/components/edit-license-modal/edit-license-modal.component";
import { MetadataTabs } from "../../metadata.constants";

@Component({
    selector: "app-metadata-license-tab",
    imports: [
        //-----//
        NgIf,
        //-----//
        MatIconModule,
        //-----//
        BlockRowDataComponent,
        LinkPropertyComponent,
    ],
    templateUrl: "./metadata-license-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataLicenseTabComponent {
    @Input(RoutingResolvers.METADATA_LICENSE_TAB_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private ngbModalService = inject(NgbModal);
    private navigationService = inject(NavigationService);

    public get license(): MaybeNullOrUndefined<LicenseFragment> {
        return this.datasetMetadataTabData.overviewUpdate.overview.metadata.currentLicense as LicenseFragment;
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.datasetMetadataTabData.datasetBasics;
    }

    public get canEditLicense(): boolean {
        return this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
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
        modalRefInstance.datasetBasics = this.datasetBasics;
        from(modalRef.result)
            .pipe(
                take(1),
                catchError(() => of(null)),
            )
            .subscribe(() => {
                this.navigationService.navigateToMetadata(
                    { accountName: this.datasetBasics.owner.accountName, datasetName: this.datasetBasics.name },
                    MetadataTabs.License,
                );
            });
    }
}
