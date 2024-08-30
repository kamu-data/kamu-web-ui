import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-source-name-step",
    templateUrl: "./source-name-step.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceNameStepComponent {
    @Input({ required: true }) public form: FormGroup;
}
