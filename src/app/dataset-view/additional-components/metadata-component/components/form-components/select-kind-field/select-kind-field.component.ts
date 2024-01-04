import { FormGroup } from "@angular/forms";
import { RadioControlType } from "../../source-events/add-polling-source/form-control.source";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-select-kind-field",
    templateUrl: "./select-kind-field.component.html",
    styleUrls: ["./select-kind-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgbTooltipConfig],
})
export class SelectKindFieldComponent {
    @Input() public form: FormGroup;
    @Input() public data: RadioControlType[];
    public openDelay: number = AppValues.SHORT_DELAY_MS;
}
