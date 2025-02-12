import { MaybeNull } from "../../../../../interface/app.types";
import { FormControl } from "@angular/forms";

export interface LicenseFormType {
    name: FormControl<MaybeNull<string>>;
    shortName: FormControl<MaybeNull<string>>;
    websiteUrl: FormControl<MaybeNull<string>>;
    spdxId: FormControl<MaybeNull<string>>;
}
