/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { getSourcesDescriptors } from "src/app/dataset-block/metadata-block/components/event-details/components/common-sources/sources-event.source";
import { DatasetNameByIdPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { SimplePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/simple-property/simple-property.component";
import { TemporalTablesPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/temporal-tables-property/temporal-tables-property.component";
import { EventRowDescriptorsByField } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/dynamic-events.model";

import { SetTransformTooltipsTexts } from "@common/tooltips/set-transform.text";

export const SET_TRANSFORM_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "SetTransform.TransformSql.engine": getSourcesDescriptors("SetTransform.TransformSql.engine"),

    "SetTransform.TransformSql.queries": getSourcesDescriptors("SetTransform.TransformSql.queries"),

    "SetTransform.TransformSql.temporalTables": {
        label: "Temporal tables:",
        tooltip: SetTransformTooltipsTexts.TEMPORAL_TABLES,
        presentationComponent: TemporalTablesPropertyComponent,
        separateRowForValue: true,
        dataTestId: "set-transform-transformSql-temporal-tables",
    },

    "SetTransform.Dataset.id": {
        label: "Id:",
        tooltip: SetTransformTooltipsTexts.DATASET_ID,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-id",
    },

    "SetTransform.TransformInputDatasetNotAccessible.datasetRef": {
        label: "Id:",
        tooltip: SetTransformTooltipsTexts.DATASET_ID_PRIVATE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-datasetNotAccessible-datasetRef",
    },

    "SetTransform.TransformInputDatasetNotAccessible.message": {
        label: "Dataset:",
        tooltip: SetTransformTooltipsTexts.DATASET_NOT_ACCESSIBLE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-datasetNotAccessible-type",
    },

    "SetTransform.Dataset.name": {
        label: "Dataset:",
        tooltip: SetTransformTooltipsTexts.DATASET_SUMMARY,
        presentationComponent: DatasetNameByIdPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-name",
    },

    "SetTransform.Dataset.alias": {
        label: "Query alias:",
        tooltip: SetTransformTooltipsTexts.DATASET_ALIAS,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-alias",
    },

    "SetTransform.Dataset.datasetRef": {
        label: "Dataset reference:",
        tooltip: SetTransformTooltipsTexts.DATASET_REF,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-dataset-ref",
    },
};
