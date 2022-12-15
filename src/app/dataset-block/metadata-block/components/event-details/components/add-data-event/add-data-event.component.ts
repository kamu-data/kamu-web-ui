import { AddDataEventFragment } from "src/app/api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-add-data-event",
    templateUrl: "./add-data-event.component.html",
    styleUrls: ["./add-data-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataEventComponent {
    @Input() public event: AddDataEventFragment;
    @Input() public datasetInfo: DatasetInfo;
}
