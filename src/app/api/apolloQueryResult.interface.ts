import { DatasetKind, SearchAutocompleteQuery } from "./kamu.graphql";

export interface ApolloQuerySearchResultNodeInterface {
    __typename: "Dataset";
    id: any;
    name: string;
    kind: DatasetKind;
}
