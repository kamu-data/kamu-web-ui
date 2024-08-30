import { MaybeNull } from "./../../../../../../common/app.types";
import { FormControl } from "@angular/forms";

export interface KeyValueForm {
    name: FormControl<MaybeNull<string>>;
    value: FormControl<MaybeNull<string>>;
}
