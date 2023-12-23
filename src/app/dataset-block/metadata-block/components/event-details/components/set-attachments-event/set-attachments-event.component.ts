import { BaseComponent } from "src/app/common/base.component";
import { SetAttachments } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-set-attachments-event",
    templateUrl: "./set-attachments-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAttachmentsEventComponent extends BaseComponent {
    @Input() public event: SetAttachments;
}
