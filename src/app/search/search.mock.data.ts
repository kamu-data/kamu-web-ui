import { DatasetKind } from "../api/kamu.graphql.interface";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "../interface/search.interface";

export const mockDataDataset: DatasetAutocompleteItem[] = [
    {
        dataset: {
            id: "id",
            kind: DatasetKind.Root,
            name: "mockName",
            owner: { id: "omnerId", name: "ownerName" },
        },
        __typename: TypeNames.datasetType,
    },

    {
        dataset: {
            id: "id",
            kind: DatasetKind.Derivative,
            name: "mockName",
            owner: { id: "omnerId", name: "ownerName" },
        },
        __typename: TypeNames.allDataType,
    },
];
