import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { BaseField } from "../base-field";
import { EventTimeSourceKind } from "../../add-polling-source/add-polling-source-form.types";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-select-date-format-field",
    templateUrl: "./select-date-format-field.component.html",
    styleUrls: ["./select-date-format-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDateFormatFieldComponent
    extends BaseField
    implements OnInit
{
    @Input() public innerTooltips: Record<string, string>;
    public currentSource: EventTimeSourceKind;
    public eventTimeSourceKind: typeof EventTimeSourceKind =
        EventTimeSourceKind;
    public readonly KIND_NAME_CONTROL = "kind";
    public readonly PATTERN_NAME_CONTROL = "pattern";
    public readonly PATTERN_TOOLTIP =
        "Regular expression where first group contains the timestamp string.";
    public readonly TIMESTAMP_TOOLTIP =
        "Format of the expected timestamp in java.text.SimpleDateFormat form.";
    public readonly TIMESTAMP_FORMAT_NAME_CONTROL = "timestampFormat";
    public readonly FORMATS: string[] = [
        "YYYY-MM-DDTHH:mm:ss.sss",
        "YYYY-MM-DDTHH:mm:ss",
        "YYYY-MM-DD",
        "YYYY-M-DTHH:mm:ss.sss",
        "YYYY-M-DTHH:mm:ss",
        "YYYY-M-D",
    ];

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.chooseEventTimeSource();
    }

    public get eventTimeGroup(): FormGroup {
        return this.form.get(this.controlName) as FormGroup;
    }

    private chooseEventTimeSource(): void {
        this.currentSource = this.eventTimeGroup.get(this.KIND_NAME_CONTROL)
            ?.value as EventTimeSourceKind;
        const subscription = this.eventTimeGroup
            .get(this.KIND_NAME_CONTROL)
            ?.valueChanges.subscribe((kind: string) => {
                if (kind === this.eventTimeSourceKind.FROM_METADATA) {
                    this.currentSource = EventTimeSourceKind.FROM_METADATA;
                    this.eventTimeGroup.removeControl(
                        this.PATTERN_NAME_CONTROL,
                    );
                    this.eventTimeGroup.removeControl(
                        this.TIMESTAMP_FORMAT_NAME_CONTROL,
                    );
                } else {
                    this.currentSource = EventTimeSourceKind.FROM_PATH;
                    this.eventTimeGroup.addControl(
                        this.PATTERN_NAME_CONTROL,
                        this.fb.control("", RxwebValidators.required()),
                    );
                    this.eventTimeGroup.addControl(
                        this.TIMESTAMP_FORMAT_NAME_CONTROL,
                        this.fb.control(""),
                    );
                }
            });
        if (subscription) this.trackSubscription(subscription);
    }
}
