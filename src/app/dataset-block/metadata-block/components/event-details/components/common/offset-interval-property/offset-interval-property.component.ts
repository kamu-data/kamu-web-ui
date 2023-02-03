import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { OffsetInterval } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-interval-property",
    templateUrl: "./offset-interval-property.component.html",
    styleUrls: ["./offset-interval-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetIntervalPropertyComponent extends BasePropertyComponent {
    @Input() public data: OffsetInterval;
}
