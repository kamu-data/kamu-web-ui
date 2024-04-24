import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) {
        super();
    }

    ngOnInit(): void {}

    public getFile(event: Event): void {
        console.log("event", event);
    }
}
