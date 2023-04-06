import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputFieldComponent } from "./input-field/input-field.component";
import { CheckboxFieldComponent } from "./checkbox-field/checkbox-field.component";
import { ArrayKeysFieldComponent } from "./array-keys-field/array-keys-field.component";
import { KeyValueFieldComponent } from "./key-value-field/key-value-field.component";
import { SelectKindFieldComponent } from "./select-kind-field/select-kind-field.component";
import { SchemaFieldComponent } from "./schema-field/schema-field.component";
import { MatTableModule } from "@angular/material/table";
@NgModule({
    declarations: [
        InputFieldComponent,
        CheckboxFieldComponent,
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SelectKindFieldComponent,
        SchemaFieldComponent,
    ],
    exports: [
        InputFieldComponent,
        CheckboxFieldComponent,
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SelectKindFieldComponent,
        SchemaFieldComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatTableModule],
})
export class PollingSourceFormComponentsModule {}
