import {Datasets, MetadataBlockExtended, MetadataBlockFragment} from "../api/kamu.graphql.interface";

export type MetadataBlockExtendedFragment =
    | MetadataBlockExtended
    | MetadataBlockFragment;

export interface DatasetFragment extends Datasets {
    datasets: {
        metadata: {
            chain: {
                blocks: {
                    nodes: MetadataBlockFragment[];
                };
            };
        };
    };
}