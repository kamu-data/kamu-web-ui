import { SqlQueryStep } from "../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { sqlEditorOptionsForEvents } from "../../../config-editor.events";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-sql-query-viewer",
    templateUrl: "./sql-query-viewer.component.html",
    styleUrls: ["./sql-query-viewer.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlQueryViewerComponent extends BasePropertyComponent {
    public sqlEditorOptions = sqlEditorOptionsForEvents;
    public get queries(): SqlQueryStep[] {
        return this.data as SqlQueryStep[];
    }
}
