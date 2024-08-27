import { FormControl } from "@angular/forms";
import { MaybeNull } from "src/app/common/app.types";

export interface FileUrlFormType {
    fileUrl: FormControl<MaybeNull<string>>;
}
