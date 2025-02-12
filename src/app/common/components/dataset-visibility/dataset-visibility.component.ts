import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetVisibilityOutput } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-visibility",
    templateUrl: "./dataset-visibility.component.html",
    styleUrls: ["./dataset-visibility.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetVisibilityComponent {
    @Input({ required: true }) public datasetVisibility: DatasetVisibilityOutput;

    public get isPrivate(): boolean {
        return this.datasetVisibility.__typename === "PrivateDatasetVisibility";
    }
}
