import { Directive, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseComponent } from "src/app/common/base.component";

@Directive()
export abstract class BaseField extends BaseComponent {
    @Input({ required: true }) public form: FormGroup;
    @Input({ required: true }) public controlName: string;
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public tooltip: string;
    @Input() public dataTestId?: string;
}
