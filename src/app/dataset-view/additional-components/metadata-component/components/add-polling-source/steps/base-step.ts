import { FormGroup } from "@angular/forms";
import { BaseComponent } from "src/app/common/base.component";
import { JsonFormData, ControlType } from "../add-polling-source-form.types";
import { RadioControlType } from "../form-control.source";

export abstract class BaseStep extends BaseComponent {
    public parentForm: FormGroup;
    public sectionStepRadioData: RadioControlType[];
    public sectionFormData: JsonFormData;
    public controlType: typeof ControlType = ControlType;
    public defaultKind: string;
    public kindNameControl = "kind";
}
