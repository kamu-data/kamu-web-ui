import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { EventTimeSourceKind } from "../../add-polling-source/add-polling-source-form.types";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-event-time-field",
    templateUrl: "./event-time-field.component.html",
    styleUrls: ["./event-time-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTimeFieldComponent extends BaseField implements OnInit {
    public currentSource: EventTimeSourceKind;
    public eventTimeSourceKind: typeof EventTimeSourceKind =
        EventTimeSourceKind;
    public readonly kindNameControl = "kind";
    public readonly patternNameControl = "pattern";
    public readonly timestampFormatNameControl = "timestampFormat";
    public formats: string[] = [
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
    public get eventTimeGroup(): FormGroup {
        return this.form.get(this.controlName) as FormGroup;
    }
    ngOnInit(): void {
        this.chooseEventTimeSource();
    }

    private chooseEventTimeSource(): void {
        this.currentSource = this.eventTimeGroup.get(this.kindNameControl)
            ?.value as EventTimeSourceKind;
        const subscription = this.eventTimeGroup
            .get(this.kindNameControl)
            ?.valueChanges.subscribe((kind: string) => {
                if (kind === this.eventTimeSourceKind.FROM_METADATA) {
                    this.currentSource = EventTimeSourceKind.FROM_METADATA;
                    this.eventTimeGroup.removeControl(this.patternNameControl);
                    this.eventTimeGroup.removeControl(
                        this.timestampFormatNameControl,
                    );
                } else {
                    this.currentSource = EventTimeSourceKind.FROM_PATH;
                    this.eventTimeGroup.addControl(
                        this.patternNameControl,
                        this.fb.control("", RxwebValidators.required()),
                    );
                    this.eventTimeGroup.addControl(
                        this.timestampFormatNameControl,
                        this.fb.control(""),
                    );
                }
            });
        if (subscription) this.trackSubscription(subscription);
    }
}
