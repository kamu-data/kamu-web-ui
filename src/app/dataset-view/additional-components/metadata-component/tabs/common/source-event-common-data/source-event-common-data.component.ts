/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import { AddPushSourceEventFragment, SetPollingSourceEventFragment } from "@api/kamu.graphql.interface";

import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";
import { EnginePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/engine-property/engine-property.component";
import { MergeStrategyPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/merge-strategy-property/merge-strategy-property.component";
import { SchemaPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/schema-property/schema-property.component";
import { SeparatorPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/separator-property/separator-property.component";
import { SqlQueryViewerComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/sql-query-viewer/sql-query-viewer.component";

@Component({
    selector: "app-source-event-common-data",
    imports: [
        //-----//
        NgIf,
        //-----//
        BlockRowDataComponent,
        CardsPropertyComponent,
        EnginePropertyComponent,
        MergeStrategyPropertyComponent,
        SchemaPropertyComponent,
        SqlQueryViewerComponent,
        SeparatorPropertyComponent,
    ],
    templateUrl: "./source-event-common-data.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceEventCommonDataComponent {
    @Input({ required: true }) public sourceEvent: SetPollingSourceEventFragment | AddPushSourceEventFragment;

    public readonly SOURCES_TOOLTIPS: typeof SourcesTooltipsTexts = SourcesTooltipsTexts;

    public readonly ReadSectionMapping: Record<string, string> = {
        ReadStepCsv: "Csv",
        ReadStepGeoJson: "Geo json",
        ReadStepEsriShapefile: "Esri shapefile",
        ReadStepParquet: "Parquet",
        ReadStepJson: "Json",
        ReadStepNdJson: "Newline-delimited json",
        ReadStepNdGeoJson: "Newline-delimited geo json",
    };
}
