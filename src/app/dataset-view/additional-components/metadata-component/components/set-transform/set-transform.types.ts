import { TransformInput } from "src/app/api/kamu.graphql.interface";

export type TransformSelectedInput = Omit<
    TransformInput,
    "__typename" | "dataset"
>;
