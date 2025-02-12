import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetSearchOverviewFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-dataset-list",
    templateUrl: "./dataset-list.component.html",
    styleUrls: ["./dataset-list.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetListComponent {
    @Input({ required: true }) public dataSource: DatasetSearchOverviewFragment[];
    @Input({ required: true }) public totalCount = 0;
    @Input({ required: true }) public resultUnitText: string;
    @Input({ required: true }) public hasResultQuantity?: boolean = false;
    @Input({ required: true }) public isClickableRow?: boolean = false;
    @Input({ required: true }) public sortOptions: {
        value: string;
        label: string;
        active: boolean;
    }[];
}
