import { DatasetKind } from "./kamu.graphql.interface";

export interface ApolloQuerySearchResultNodeInterface {
    __typename: "Dataset";
    id: any;
    name: string;
    kind: DatasetKind;
}
