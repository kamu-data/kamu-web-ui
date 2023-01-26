import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    OffsetInterval,
    BlockInterval,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-interval-property",
    templateUrl: "./interval-property.component.html",
    styleUrls: ["./interval-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalPropertyComponent extends BasePropertyComponent {
    @Input() public data: OffsetInterval | BlockInterval;
}
