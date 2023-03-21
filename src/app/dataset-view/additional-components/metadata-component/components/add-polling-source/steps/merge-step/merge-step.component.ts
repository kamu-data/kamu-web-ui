import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { FormGroup, FormGroupDirective } from "@angular/forms";
import { mergeStepRadioControls } from "../../form-control.source";

@Component({
    selector: "app-merge-step",
    templateUrl: "./merge-step.component.html",
    styleUrls: ["./merge-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeStepComponent implements OnInit {
    @Input() public mergeForm: FormGroup;
    public form: FormGroup;
    public mergeStepRadioData = mergeStepRadioControls;

    constructor(private rootFormGroupDirective: FormGroupDirective) {}

    ngOnInit(): void {
        this.form = this.rootFormGroupDirective.control.get(
            "merge",
        ) as FormGroup;
    }
}
