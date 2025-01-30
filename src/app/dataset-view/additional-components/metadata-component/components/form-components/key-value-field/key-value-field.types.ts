import { MaybeNull } from "../../../../../../common/types/app.types";
import { FormControl } from "@angular/forms";

export interface KeyValueForm {
    name: FormControl<MaybeNull<string>>;
    value: FormControl<MaybeNull<string>>;
}
