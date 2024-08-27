import { FormControl } from "@angular/forms";
import { MaybeNull } from "src/app/common/app.types";

export interface KeyValueFormType {
    key: FormControl<MaybeNull<string>>;
    value: FormControl<MaybeNull<string>>;
    isSecret: FormControl<MaybeNull<boolean>>;
}
