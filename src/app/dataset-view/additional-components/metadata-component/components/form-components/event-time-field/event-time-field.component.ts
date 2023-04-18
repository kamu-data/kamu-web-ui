import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { EventTimeSourceKind } from "../../add-polling-source/add-polling-source-form.types";
import { EventTimeSource } from "src/app/api/kamu.graphql.interface";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
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

    constructor(private fb: FormBuilder) {
        super();
    }
    ngOnInit(): void {
        const eventTimeControl = this.form.get(this.controlName) as FormGroup;
        // eventTimeControl.valueChanges.subscribe(
        //     (sourceObject: EventTimeSource & { kind: string }) => {
        //         const { kind } = sourceObject;
        //         if (kind === this.eventTimeSourceKind.FROM_METADATA) {
        //             this.currentSource = EventTimeSourceKind.FROM_METADATA;
        //         } else {
        //             this.currentSource = EventTimeSourceKind.FROM_PATH;
        //             eventTimeControl.addControl(
        //                 "pattern",
        //                 this.fb.control("", RxwebValidators.required()),
        //             );

        //             // eventTimeControl.addControl(
        //             //     "timestampFormat",
        //             //     new FormControl(""),
        //             // );
        //         }
        //     },
        // );
    }
}
