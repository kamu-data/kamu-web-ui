import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-block-row-data",
    templateUrl: "./block-row-data.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockRowDataComponent {
    @Input() public label: string;
    @Input() public tooltip: string;
}
