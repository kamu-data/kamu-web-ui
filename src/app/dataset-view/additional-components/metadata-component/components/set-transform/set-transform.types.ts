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
        event: SetTransFormYamlType;
    };
}

export type SetTransFormYamlType = Omit<SetTransform, "__typename"> & {
    kind: string;
    transform: {
        query?: string;
    };
};

export interface DatasetNode {
    name: string;
    type?: string;
    owner?: string;
    children?: DatasetNode[];
}
