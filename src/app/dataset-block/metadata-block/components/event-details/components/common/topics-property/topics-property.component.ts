import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MqttTopicSubscription } from "src/app/api/kamu.graphql.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";

@Component({
    selector: "app-topics-property",
    templateUrl: "./topics-property.component.html",
    styleUrls: ["./topics-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsPropertyComponent extends BasePropertyComponent {
    @Input() public data: MqttTopicSubscription[];

    public get tableSource(): DataRow[] {
        const result: DataRow[] = [];
        this.data.forEach(({ path, qos }: MqttTopicSubscription) =>
            result.push({ path: path as string, qos: (qos as string) ?? "" }),
        );
        return result;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
