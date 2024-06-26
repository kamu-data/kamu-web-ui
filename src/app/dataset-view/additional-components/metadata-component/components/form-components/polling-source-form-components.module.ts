import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import { InputFieldComponent } from "./input-field/input-field.component";
import { CheckboxFieldComponent } from "./checkbox-field/checkbox-field.component";
import { ArrayKeysFieldComponent } from "./array-keys-field/array-keys-field.component";
import { KeyValueFieldComponent } from "./key-value-field/key-value-field.component";
import { SelectKindFieldComponent } from "./select-kind-field/select-kind-field.component";
import { SchemaFieldComponent } from "./schema-field/schema-field.component";
import { MatTableModule } from "@angular/material/table";
import { NgbTooltipModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { CacheFieldComponent } from "./cache-field/cache-field.component";
import { OrderFieldComponent } from "./order-field/order-field.component";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { TypeaheadFieldComponent } from "./typeahead-field/typeahead-field.component";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { SelectDateFormatFieldComponent } from "./select-date-format-field/select-date-format-field.component";
import { JsonKindFieldComponent } from "./json-kind-field/json-kind-field.component";
import { NumberFieldComponent } from "./number-field/number-field.component";
import { TopicsFieldComponent } from "./topics-field/topics-field.component";

@NgModule({
    declarations: [
        InputFieldComponent,
        CheckboxFieldComponent,
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SelectKindFieldComponent,
        SchemaFieldComponent,
        SelectDateFormatFieldComponent,
        CacheFieldComponent,
        OrderFieldComponent,
        TypeaheadFieldComponent,
        JsonKindFieldComponent,
        NumberFieldComponent,
        TopicsFieldComponent,
    ],
    exports: [
        InputFieldComponent,
        CheckboxFieldComponent,
        ArrayKeysFieldComponent,
        KeyValueFieldComponent,
        SelectKindFieldComponent,
        SchemaFieldComponent,
        SelectDateFormatFieldComponent,
        CacheFieldComponent,
        OrderFieldComponent,
        TypeaheadFieldComponent,
        JsonKindFieldComponent,
        NumberFieldComponent,
        TopicsFieldComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatTableModule,
        NgbTypeaheadModule,
        JsonPipe,
        RxReactiveFormsModule,
        NgxTrimDirectiveModule,
        NgbTooltipModule,
        SharedModule,
    ],
})
export class PollingSourceFormComponentsModule {}
