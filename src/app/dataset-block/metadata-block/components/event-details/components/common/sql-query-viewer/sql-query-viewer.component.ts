import { SqlQueryStep } from "../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-sql-query-viewer",
    templateUrl: "./sql-query-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlQueryViewerComponent extends BasePropertyComponent {
    @Input() public data: SqlQueryStep[] | string;

    public get dataAsArray(): SqlQueryStep[] {
        return this.data as SqlQueryStep[];
    }

    public get dataAsString(): string {
        return this.data as string;
    }

    public get isArray(): boolean {
        return Array.isArray(this.data);
    }
}
