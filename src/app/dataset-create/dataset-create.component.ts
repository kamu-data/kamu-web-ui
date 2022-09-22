import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-dataset-create",
    templateUrl: "./dataset-create.component.html",
    styleUrls: ["./dataset-create.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetCreateComponent {}
