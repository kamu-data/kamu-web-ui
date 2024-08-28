import { FormControl, FormGroup } from "@angular/forms";
import { PollingGroupEnum } from "../../dataset-settings.model";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";

export interface PollingFormType {
    updatesState: FormControl<boolean>;
    pollingGroup: FormGroup<PollingGroupType>;
}

export interface PollingGroupType {
    __typename: FormControl<MaybeNull<PollingGroupEnum>>;
    every: FormControl<MaybeNull<number>>;
    unit: FormControl<MaybeNull<TimeUnit>>;
    cronExpression: FormControl<MaybeNull<string>>;
    fetchUncacheable: FormControl<boolean>;
}

export interface BatchingFormType {
    every: FormControl<MaybeNull<number>>;
    unit: FormControl<MaybeNull<TimeUnit>>;
    minRecordsToAwait: FormControl<MaybeNull<number>>;
}
