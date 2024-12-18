import { FormControl, FormGroup } from "@angular/forms";
import { PollingGroupEnum } from "../../dataset-settings.model";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";

export interface PollingFormType {
    pollingGroup: FormGroup<PollingGroupType>;
}

export interface PollingGroupType {
    updatesState: FormControl<boolean>;
    __typename: FormControl<MaybeNull<PollingGroupEnum>>;
    every: FormControl<MaybeNull<number>>;
    unit: FormControl<MaybeNull<TimeUnit>>;
    cronExpression: FormControl<MaybeNull<string>>;
}

export interface BatchingFormType {
    updatesState: FormControl<boolean>;
    every: FormControl<MaybeNull<number>>;
    unit: FormControl<MaybeNull<TimeUnit>>;
    minRecordsToAwait: FormControl<MaybeNull<number>>;
}

export interface IngestConfigurationFormType {
    fetchUncacheable: FormControl<boolean>;
}
