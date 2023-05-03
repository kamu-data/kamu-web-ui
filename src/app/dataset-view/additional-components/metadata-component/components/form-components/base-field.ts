import { Directive, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseComponent } from "src/app/common/base.component";

@Directive()
export abstract class BaseField extends BaseComponent {
    @Input() public form: FormGroup;
    @Input() public controlName: string;
    @Input() public label: string;
    @Input() public tooltip: string;
    @Input() public dataTestId?: string;
}
