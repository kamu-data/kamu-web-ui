import { MaybeNull } from "./../../../../../common/app.types";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { OWL_DATE_TIME_FORMATS } from "@danielmoncada/angular-datetime-picker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MY_MOMENT_FORMATS } from "src/app/common/data.helpers";

@Component({
    selector: "app-edit-watermark-modal",
    templateUrl: "./edit-watermark-modal.component.html",
    styleUrls: ["./edit-watermark-modal.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ],
})
export class EditWatermarkModalComponent implements OnInit {
    @Input() public currentWatermark: MaybeNull<string>;
    public date: Date | string;

    constructor(public activeModal: NgbActiveModal) {}
    ngOnInit(): void {
        this.date = this.currentWatermark ? this.currentWatermark : new Date();
    }

    public setDateTime(): void {
        console.log("dateatime=", JSON.stringify(this.date));
    }
}
