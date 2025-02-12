import { MaybeNull } from "../../../../../../interface/app.types";
import { FormControl } from "@angular/forms";

export interface KeyValueFormType {
    path: FormControl<MaybeNull<string>>;
    qos: FormControl<MaybeNull<string>>;
}
