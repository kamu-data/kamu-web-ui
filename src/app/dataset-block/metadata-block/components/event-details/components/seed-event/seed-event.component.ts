import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetKind, Seed } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-seed-event",
    templateUrl: "./seed-event.component.html",
    styleUrls: ["./seed-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedEventComponent {
    @Input() public event: Seed;

    public datasetKind(kind: DatasetKind): string {
        return DataHelpers.datasetKind2String(kind);
    }
}
