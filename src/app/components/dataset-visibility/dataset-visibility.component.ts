import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetVisibilityOutput } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-visibility",
    templateUrl: "./dataset-visibility.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetVisibilityComponent {
    @Input({ required: true }) datasetVisibility: DatasetVisibilityOutput;

    public get isPrivate(): boolean {
        return this.datasetVisibility.__typename === "PrivateDatasetVisibility";
    }
}
