import { TemporalTablesPropertyComponent } from "./../common/temporal-tables-property/temporal-tables-property.component";
import { SimplePropertyComponent } from "./../common/simple-property/simple-property.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { OwnerPropertyComponent } from "../common/owner-property/owner-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { DatasetNameByIdPropertyComponent } from "../common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { SetTransformToolipsTexts } from "src/app/common/tooltips/set-transform.text";

export const SET_TRANSFORM_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "SetTransform.TransformSql.engine": {
        label: "Engine:",
        tooltip: SetTransformToolipsTexts.ENGINE,
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-transformSql-engine",
    },

    "SetTransform.TransformSql.queries": {
        label: "Queries:",
        tooltip: SetTransformToolipsTexts.QUERIES,
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "set-transform-transformSql-queries",
    },

    "SetTransform.TransformSql.temporalTables": {
        label: "Temporal tables:",
        tooltip: SetTransformToolipsTexts.TEMPORAL_TABLES,
        presentationComponent: TemporalTablesPropertyComponent,
        separateRowForValue: true,
        dataTestId: "set-transform-transformSql-temporal-tables",
    },

    "SetTransform.Dataset.id": {
        label: "Id:",
        tooltip: SetTransformToolipsTexts.DATASET_ID,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-id",
    },

    "SetTransform.Dataset.kind": {
        label: "Dataset type:",
        tooltip: SetTransformToolipsTexts.DATASET_KIND,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-kind",
    },

    "SetTransform.Dataset.name": {
        label: "Name:",
        tooltip: SetTransformToolipsTexts.DATASET_NAME,
        presentationComponent: DatasetNameByIdPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-name",
    },

    "SetTransform.Dataset.owner": {
        label: "Owner:",
        tooltip: SetTransformToolipsTexts.DATASET_OWNER,
        presentationComponent: OwnerPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-owner",
    },

    "SetTransform.Dataset.alias": {
        label: "Query alias:",
        tooltip: SetTransformToolipsTexts.DATASET_ALIAS,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-alias",
    },
};
