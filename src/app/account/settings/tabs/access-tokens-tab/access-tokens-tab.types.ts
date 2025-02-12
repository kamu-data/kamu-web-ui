import { FormControl } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";

export interface CreateTokenFormType {
    name: FormControl<MaybeNull<string>>;
}
