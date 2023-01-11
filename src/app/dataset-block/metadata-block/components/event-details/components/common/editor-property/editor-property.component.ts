import { SqlQueryStep } from "./../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { sqlEditorOptionsForEvents } from "../../../config-editor.events";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-editor-property",
    templateUrl: "./editor-property.component.html",
    styleUrls: ["./editor-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorPropertyComponent extends BasePropertyComponent {
    public sqlEditorOptions = sqlEditorOptionsForEvents;
    public test =
        'SELECT CAST(UNIX_TIMESTAMP(Reported_Date, "yyyy-MM-dd") as TIMESTAMP) as reported_date, Classification_Reported as classification, ROW_NUMBER() OVER (ORDER BY (Reported_Date, HA)) as id, ha, sex, age_group FROM input';

    public get queries(): SqlQueryStep[] {
        return this.data as SqlQueryStep[];
    }
}
