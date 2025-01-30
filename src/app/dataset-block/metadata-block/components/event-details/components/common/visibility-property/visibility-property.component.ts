import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DatasetVisibilityOutput } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-visibility-property",
    templateUrl: "./visibility-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibilityPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: DatasetVisibilityOutput;

    public get isPrivate(): boolean {
        return this.data.__typename === "PrivateDatasetVisibility";
    }
}
