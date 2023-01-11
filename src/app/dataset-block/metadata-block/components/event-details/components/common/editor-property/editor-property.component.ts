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
    public get queries(): SqlQueryStep[] {
        return this.data as SqlQueryStep[];
    }
}
