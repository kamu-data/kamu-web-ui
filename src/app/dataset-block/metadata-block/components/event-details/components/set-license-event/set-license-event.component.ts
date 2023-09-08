import { SetLicense } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-set-license-event",
    templateUrl: "./set-license-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetLicenseEventComponent {
    @Input() public event: SetLicense;
}
