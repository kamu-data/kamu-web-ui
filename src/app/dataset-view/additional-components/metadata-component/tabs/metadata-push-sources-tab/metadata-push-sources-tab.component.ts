/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { AddPushSourceEventFragment, DatasetKind } from "@api/kamu.graphql.interface";
import { ModalService } from "@common/components/modal/modal.service";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { SourceEventCommonDataComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/common/source-event-common-data/source-event-common-data.component";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-metadata-push-sources-tab",
    imports: [
        //-----//
        NgIf,
        NgFor,
        //-----//
        MatIconModule,
        //-----//
        FeatureFlagDirective,
        SourceEventCommonDataComponent,
    ],
    templateUrl: "./metadata-push-sources-tab.component.html",
    styleUrls: ["./metadata-push-sources-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataPushSourcesTabComponent {
    @Input(RoutingResolvers.METADATA_PUSH_SOURCES_TAB_KEY) public datasetMetadataTabData: MetadataTabData;

    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public get pushSources(): MaybeNullOrUndefined<AddPushSourceEventFragment[]> {
        return this.datasetMetadataTabData.metadataSummary.metadata.currentPushSources;
    }

    public get canEditAddPushSource(): boolean {
        return (
            this.datasetMetadataTabData.datasetBasics.kind === DatasetKind.Root &&
            Boolean(this.pushSources?.length) &&
            this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit
        );
    }

    /* istanbul ignore next */
    public onDeletePushSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public navigateToEditAddPushSource(sourceName: string): void {
        this.navigationService.navigateToAddPushSource(
            {
                accountName: this.datasetMetadataTabData.datasetBasics.owner.accountName,
                datasetName: this.datasetMetadataTabData.datasetBasics.name,
            },
            sourceName,
        );
    }
}
