import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetDataSchema } from "src/app/api/kamu.graphql.interface";
import { parseCurrentSchema } from "src/app/common/app.helpers";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-set-data-schema-event",
    templateUrl: "./set-data-schema-event.component.html",
    styleUrls: ["./set-data-schema-event.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetDataSchemaEventComponent {
    @Input() public event: SetDataSchema;

    public get datasetSchema(): MaybeNull<DatasetSchema> {
        return parseCurrentSchema(this.event.schema);
    }
}
