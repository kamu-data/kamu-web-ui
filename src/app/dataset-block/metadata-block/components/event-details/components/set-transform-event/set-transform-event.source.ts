import { SimplePropertyComponent } from "./../common/simple-property/simple-property.component";
import { EventRowDescriptor } from "../../builder.events";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { OwnerPropertyComponent } from "../common/owner-property/owner-property.component";

export const SET_TRANSFORM_SOURCE_DESCRIPTORS: Record<
    string,
    EventRowDescriptor
> = {
    "SetTransform.TransformSql.engine": {
        label: "Engine:",
        tooltip: "Identifier of the engine used for this transformation.",
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-transformSql-engine",
    },

    "SetTransform.TransformSql.queries": {
        label: "Queries:",
        tooltip: "Queries use for specifying multi-step SQL transformations.",
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "set-transform-transformSql-queries",
    },

    "SetTransform.Dataset.id": {
        label: "Id:",
        tooltip: "Unique dataset identifier.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-id",
    },

    "SetTransform.Dataset.kind": {
        label: "Dataset type:",
        tooltip: "Type of the dataset.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-kind",
    },

    "SetTransform.Dataset.name": {
        label: "Name:",
        tooltip: "Alias of the dataset.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-name",
    },

    "SetTransform.Dataset.owner": {
        label: "Owner:",
        tooltip: "Owner of the dataset.",
        presentationComponent: OwnerPropertyComponent,
        separateRowForValue: false,
        dataTestId: "set-transform-dataset-owner",
    },
};
