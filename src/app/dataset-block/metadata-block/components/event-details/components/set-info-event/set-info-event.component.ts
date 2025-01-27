import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetInfo } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-set-info-event",
    templateUrl: "./set-info-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetInfoEventComponent extends BaseComponent {
    @Input({ required: true }) event: SetInfo;
}
