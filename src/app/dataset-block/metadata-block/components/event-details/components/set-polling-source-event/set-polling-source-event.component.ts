import { SetPollingSource } from './../../../../../../api/kamu.graphql.interface';
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetInfo } from 'src/app/interface/navigation.interface';

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "./set-polling-source-event.component.html",
    styleUrls: ["./set-polling-source-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPollingSourceEventComponent {
  @Input() public event: SetPollingSource;
  @Input() public datasetInfo: DatasetInfo;
}
