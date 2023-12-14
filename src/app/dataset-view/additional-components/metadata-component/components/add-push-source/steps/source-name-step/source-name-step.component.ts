import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-source-name-step",
    templateUrl: "./source-name-step.component.html",
    styleUrls: ["./source-name-step.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceNameStepComponent {
    @Input() public form: FormGroup;
}
