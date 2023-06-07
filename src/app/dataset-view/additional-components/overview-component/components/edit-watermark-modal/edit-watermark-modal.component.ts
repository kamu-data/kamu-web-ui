import { MaybeNull } from "./../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-edit-watermark-modal",
    templateUrl: "./edit-watermark-modal.component.html",
    styleUrls: ["./edit-watermark-modal.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditWatermarkModalComponent {
    @Input() public currentWatermark: MaybeNull<string>;

    constructor(public activeModal: NgbActiveModal) {}
}
