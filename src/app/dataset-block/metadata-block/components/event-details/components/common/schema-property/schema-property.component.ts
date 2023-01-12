import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DataRow } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-schema-property",
    templateUrl: "./schema-property.component.html",
    styleUrls: ["./schema-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaPropertyComponent extends BasePropertyComponent {
    public get tableSource(): DataRow[] {
        const result: DataRow[] = [];
        (this.data as string[]).forEach((item: string) =>
            result.push({ name: item.split(" ")[0], type: item.split(" ")[1] }),
        );
        return result;
    }
}
