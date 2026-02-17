/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import { ModalService } from "@common/components/modal/modal.service";
import { YamlEventViewerComponent } from "@common/components/yaml-event-viewer/yaml-event-viewer.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { isNil, promiseWithCatch } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { SetPollingSourceTooltipsTexts } from "@common/tooltips/set-polling-source-tooltips.text";
import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import { DatasetKind, EnvVar, FetchStepUrl, SetPollingSourceEventFragment } from "src/app/api/kamu.graphql.interface";
import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";
import { EnvVariablesPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/env-variables-property/env-variables-property.component";
import { EventTimePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/event-time-property/event-time-property.component";
import { LinkPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/link-property/link-property.component";
import { OrderPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/order-property/order-property.component";
import { StepTypePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/step-type-property/step-type-property.component";
import { TopicsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/topics-property/topics-property.component";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";

import { MetadataTabData } from "../../metadata.constants";
import { SourceEventCommonDataComponent } from "../common/source-event-common-data/source-event-common-data.component";

@Component({
    selector: "app-metadata-polling-source-tab",
    imports: [
        //-----//
        NgIf,
        //-----//
        MatIconModule,
        //-----//
        BlockRowDataComponent,
        CardsPropertyComponent,
        EnvVariablesPropertyComponent,
        EventTimePropertyComponent,
        FeatureFlagDirective,
        LinkPropertyComponent,
        OrderPropertyComponent,
        SourceEventCommonDataComponent,
        StepTypePropertyComponent,
        TopicsPropertyComponent,
        YamlEventViewerComponent,
    ],
    templateUrl: "./metadata-polling-source-tab.component.html",
    styleUrls: ["./metadata-polling-source-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataPollingSourceTabComponent {
    @Input(RoutingResolvers.METADATA_POLLING_SOURCE_TAB_KEY) public datasetMetadataTabData: MetadataTabData;

    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public readonly POLLING_SOURCE_TOOLTIPS: typeof SetPollingSourceTooltipsTexts = SetPollingSourceTooltipsTexts;
    public readonly SOURCES_TOOLTIPS: typeof SourcesTooltipsTexts = SourcesTooltipsTexts;

    public get pollingSource(): MaybeNullOrUndefined<SetPollingSourceEventFragment> {
        return this.datasetMetadataTabData.metadataSummary.metadata.currentPollingSource;
    }

    public get headers(): EnvVar[] {
        return (this.datasetMetadataTabData.metadataSummary.metadata.currentPollingSource?.fetch as FetchStepUrl)
            .headers as EnvVar[];
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

    /* istanbul ignore next */
    public onDeletePollingSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
        //TODO: Implement when api exists
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
