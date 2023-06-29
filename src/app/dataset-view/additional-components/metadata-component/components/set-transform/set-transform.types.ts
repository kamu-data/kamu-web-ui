import {
    SetTransform,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";

export type TransformSelectedInput = Omit<
    TransformInput,
    "__typename" | "dataset"
>;

export interface EditSetTransformParseType {
    content: {
        event: Omit<SetTransform, "__typename"> & {
            kind: string;
        };
    };
}

export type SetTransFormYamlType = Omit<SetTransform, "__typename"> & {
    kind: string;
};

export interface DatasetNode {
    name: string;
    type?: string;
    children?: DatasetNode[];
}
