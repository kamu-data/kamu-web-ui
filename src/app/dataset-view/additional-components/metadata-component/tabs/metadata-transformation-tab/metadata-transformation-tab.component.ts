/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgFor, NgIf, TitleCasePipe } from "@angular/common";
import { DatasetKind, DatasetTransformFragment } from "src/app/api/kamu.graphql.interface";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { DatasetNamePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/dataset-name-property/dataset-name-property.component";
import { OwnerPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/owner-property/owner-property.component";
import { EnginePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/engine-property/engine-property.component";
import { SqlQueryViewerComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/sql-query-viewer/sql-query-viewer.component";
import { MatIconModule } from "@angular/material/icon";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { isNil } from "src/app/common/helpers/app.helpers";
import { NavigationService } from "src/app/services/navigation.service";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";

@Component({
    selector: "app-metadata-transformation-tab",
    standalone: true,
    imports: [
        //-----//
        NgIf,
        NgFor,
        TitleCasePipe,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
        DatasetNamePropertyComponent,
        EnginePropertyComponent,
        FeatureFlagDirective,
        OwnerPropertyComponent,
        SqlQueryViewerComponent,
    ],
    templateUrl: "./metadata-transformation-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataTransformationTabComponent {
    @Input(RoutingResolvers.METADATA_TRANSFORMATION_TAB_KEY)
    public transformation: MaybeNullOrUndefined<DatasetTransformFragment>;
    @Input(RoutingResolvers.DATASET_VIEW_METADATA_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private navigationService = inject(NavigationService);

    public get canEditSetTransform(): boolean {
        return (
            this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Derivative &&
            !isNil(this.transformation) &&
            this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit
        );
    }

    public navigateToEditSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
            datasetName: this.datasetMetadataTabData.datasetBasics.name,
        });
    }
}
