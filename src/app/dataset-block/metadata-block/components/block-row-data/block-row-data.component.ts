import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-block-row-data",
    templateUrl: "./block-row-data.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockRowDataComponent {
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public tooltip: string;
}
