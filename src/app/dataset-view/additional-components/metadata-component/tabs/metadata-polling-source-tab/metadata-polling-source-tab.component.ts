/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgIf } from "@angular/common";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetKind, SetPollingSourceEventFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { LinkPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/link-property/link-property.component";
import { YamlEventViewerComponent } from "src/app/common/components/yaml-event-viewer/yaml-event-viewer.component";
import { SourceEventCommonDataComponent } from "../common/source-event-common-data/source-event-common-data.component";
import { isNil, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { MatIconModule } from "@angular/material/icon";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";

@Component({
    selector: "app-metadata-polling-source-tab",
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
        LinkPropertyComponent,
        SourceEventCommonDataComponent,
        YamlEventViewerComponent,
        FeatureFlagDirective,
    ],
    templateUrl: "./metadata-polling-source-tab.component.html",
    styleUrls: ["./metadata-polling-source-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataPollingSourceTabComponent {
    @Input(RoutingResolvers.METADATA_POLLING_SOURCE_TAB_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public get pollingSource(): MaybeNullOrUndefined<SetPollingSourceEventFragment> {
        return this.datasetMetadataTabData.overviewUpdate.overview.metadata
            .currentPollingSource as SetPollingSourceEventFragment;
    }

    public get canEditSetPollingSource(): boolean {
        return (
            this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Root &&
            !isNil(this.pollingSource) &&
            this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit
        );
    }

    public navigateToEditPollingSource(): void {
        this.navigationService.navigateToAddPollingSource({
            accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
            datasetName: this.datasetMetadataTabData.datasetBasics.name,
        });
    }

    public onDeletePollingSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
        //TODO:
        // this.trackSubscription(
        //     this.datasetCommitService
        //         .commitEventToDataset(
        //             this.getDatasetInfoFromUrl().accountName,
        //             this.getDatasetInfoFromUrl().datasetName,
        //             this.yamlEventService.buildYamlDisablePollingSourceEvent(),
        //         )
        //         .subscribe(),
        // );
    }
}
