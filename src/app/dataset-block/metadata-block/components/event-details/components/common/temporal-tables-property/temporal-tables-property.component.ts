import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TemporalTable } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-temporal-tables-property",
    templateUrl: "./temporal-tables-property.component.html",
    styleUrls: ["./temporal-tables-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemporalTablesPropertyComponent extends BasePropertyComponent {
    @Input() public data: TemporalTable[];
}
