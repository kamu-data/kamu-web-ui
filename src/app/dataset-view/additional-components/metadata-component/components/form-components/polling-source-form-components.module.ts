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
import { SelectDateFormatFieldComponent } from "./select-date-format-field/select-date-format-field.component";
import { JsonKindFieldComponent } from "./json-kind-field/json-kind-field.component";
import { NumberFieldComponent } from "./number-field/number-field.component";
import { TopicsFieldComponent } from "./topics-field/topics-field.component";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";

@NgModule({
    declarations: [
        ArrayKeysFieldComponent,
        CacheFieldComponent,
        CheckboxFieldComponent,
        InputFieldComponent,
        JsonKindFieldComponent,
        KeyValueFieldComponent,
        NumberFieldComponent,
        OrderFieldComponent,
        SelectDateFormatFieldComponent,
        SelectKindFieldComponent,
        SchemaFieldComponent,
        TopicsFieldComponent,
        TypeaheadFieldComponent,
    ],
    exports: [
        ArrayKeysFieldComponent,
        CacheFieldComponent,
        CheckboxFieldComponent,
        InputFieldComponent,
        JsonKindFieldComponent,
        KeyValueFieldComponent,
        NumberFieldComponent,
        OrderFieldComponent,
        SelectDateFormatFieldComponent,
        SelectKindFieldComponent,
        SchemaFieldComponent,
        TopicsFieldComponent,
        TypeaheadFieldComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        JsonPipe,
        MatIconModule,
        MatTableModule,
        NgbTypeaheadModule,
        NgxTrimDirectiveModule,
        NgbTooltipModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,

        TooltipIconModule,
    ],
})
export class PollingSourceFormComponentsModule {}
