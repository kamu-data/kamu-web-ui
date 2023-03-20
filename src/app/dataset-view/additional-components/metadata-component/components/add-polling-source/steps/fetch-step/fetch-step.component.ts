/* eslint-disable @typescript-eslint/unbound-method */
import { FormGroupDirective } from "@angular/forms";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

import { fetchStepRadioControls } from "../../form-control.source";

@Component({
    selector: "app-fetch-step",
    templateUrl: "./fetch-step.component.html",
    styleUrls: ["./fetch-step.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FetchStepComponent implements OnInit {
    @Input() public fetchUrlForm: FormGroup;
    @Input() public fetchFilesGlobForm: FormGroup;
    @Input() public fetchContainerForm: FormGroup;
    form: FormGroup;

    public fetchStepRadioData = fetchStepRadioControls;

    constructor(private rootFormGroupDirective: FormGroupDirective) {}

    ngOnInit(): void {
        this.form = this.rootFormGroupDirective.control.get(
            "fetch",
        ) as FormGroup;
    }
}
