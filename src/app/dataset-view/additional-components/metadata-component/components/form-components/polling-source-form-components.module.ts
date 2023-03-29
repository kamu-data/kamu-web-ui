import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputFieldComponent } from "./input-field/input-field.component";
import { CheckboxFieldComponent } from "./checkbox-field/checkbox-field.component";
import { ArrayKeysFieldComponent } from "./array-keys-field/array-keys-field.component";
import { KeyValueFieldComponent } from "./key-value-field/key-value-field.component";
import { SelectKindFieldComponent } from "./select-kind-field/select-kind-field.component";
@NgModule({
    declarations: [
        InputFieldComponent,
        CheckboxFieldComponent,
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SelectKindFieldComponent,
    ],
    exports: [
        InputFieldComponent,
        CheckboxFieldComponent,
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SelectKindFieldComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, MatIconModule],
})
export class PollingSourceFormComponentsModule {}
