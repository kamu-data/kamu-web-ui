import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-add-people-modal",
    templateUrl: "./add-people-modal.component.html",
    styleUrls: ["./add-people-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPeopleModalComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public activeModal = inject(NgbActiveModal);
}
