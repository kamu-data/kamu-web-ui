import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { FormGroup, FormGroupDirective } from "@angular/forms";
import { readStepRadioControls } from "../../form-control.source";

@Component({
    selector: "app-read-step",
    templateUrl: "./read-step.component.html",
    styleUrls: ["./read-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadStepComponent implements OnInit {
    @Input() public readCsvForm: FormGroup;
    public form: FormGroup;

    public readStepRadioData = readStepRadioControls;

    constructor(private rootFormGroupDirective: FormGroupDirective) {}

    ngOnInit(): void {
        this.form = this.rootFormGroupDirective.control.get(
            "read",
        ) as FormGroup;
    }
}
