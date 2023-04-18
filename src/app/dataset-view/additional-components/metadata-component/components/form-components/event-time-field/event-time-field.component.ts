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
    public currentSource = EventTimeSourceKind.FROM_METADATA;
    public eventTimeSourceKind: typeof EventTimeSourceKind =
        EventTimeSourceKind;
    public readonly kindNameControl = "kind";

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
        const subscription = this.eventTimeGroup
            .get(this.kindNameControl)
            ?.valueChanges.subscribe((kind: string) => {
                if (kind === this.eventTimeSourceKind.FROM_METADATA) {
                    this.currentSource = EventTimeSourceKind.FROM_METADATA;
                    this.eventTimeGroup.removeControl("pattern");
                    this.eventTimeGroup.removeControl("timestampFormat");
                } else {
                    this.currentSource = EventTimeSourceKind.FROM_PATH;
                    this.eventTimeGroup.addControl(
                        "pattern",
                        this.fb.control("", RxwebValidators.required()),
                    );
                    this.eventTimeGroup.addControl(
                        "timestampFormat",
                        this.fb.control(""),
                    );
                }
            });
        if (subscription) this.trackSubscription(subscription);
    }
}
