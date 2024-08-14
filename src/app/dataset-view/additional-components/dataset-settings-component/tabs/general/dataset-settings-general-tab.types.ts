import { FormControl } from "@angular/forms";

export enum DatasetResetMode {
    RESET_TO_SEED = "resetToSeed",
    RESET_METADATA_ONLY = "resetMetadataOnly",
}

export interface ResetDatasetFormType {
    mode: FormControl<DatasetResetMode>;
    recursive: FormControl<boolean>;
}
