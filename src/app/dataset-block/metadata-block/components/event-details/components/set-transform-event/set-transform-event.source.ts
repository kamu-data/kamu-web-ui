/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TemporalTablesPropertyComponent } from "../common/temporal-tables-property/temporal-tables-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { OwnerPropertyComponent } from "../common/owner-property/owner-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { DatasetNameByIdPropertyComponent } from "../common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { SetTransformTooltipsTexts } from "src/app/common/tooltips/set-transform.text";
import { getSourcesDescriptors } from "../common-sources/sources-event.source";
import { VisibilityPropertyComponent } from "../common/visibility-property/visibility-property.component";

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

    "SetTransform.Dataset.kind": {
        label: "Dataset type:",
        tooltip: SetTransformTooltipsTexts.DATASET_KIND,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-kind",
    },

    "SetTransform.Dataset.visibility": {
        label: "Dataset visibility:",
        tooltip: SetTransformTooltipsTexts.DATASET_VISIBILITY,
        presentationComponent: VisibilityPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-visibility",
    },

    "SetTransform.Dataset.name": {
        label: "Name:",
        tooltip: SetTransformTooltipsTexts.DATASET_NAME,
        presentationComponent: DatasetNameByIdPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-name",
    },

    "SetTransform.Dataset.owner": {
        label: "Owner:",
        tooltip: SetTransformTooltipsTexts.DATASET_OWNER,
        presentationComponent: OwnerPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-owner",
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
