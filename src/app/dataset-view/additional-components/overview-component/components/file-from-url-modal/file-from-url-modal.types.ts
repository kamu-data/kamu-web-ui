import { FormControl } from "@angular/forms";
import { MaybeNull } from "src/app/common/types/app.types";

export interface FileUrlFormType {
    fileUrl: FormControl<MaybeNull<string>>;
}
