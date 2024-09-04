import { FormControl } from "@angular/forms";
import { DatasetKind, DatasetVisibility } from "../api/kamu.graphql.interface";

export interface CreateDatasetFormType {
    // name: FormControl<MaybeNull<string>>;
    owner: FormControl<string>;
    datasetName: FormControl<string>;
    kind: FormControl<DatasetKind>;
    visibility: FormControl<DatasetVisibility>;
}
