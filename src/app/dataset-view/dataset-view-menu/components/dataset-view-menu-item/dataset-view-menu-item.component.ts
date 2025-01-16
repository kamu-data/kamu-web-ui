import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MaybeUndefined } from "src/app/common/app.types";

@Component({
    selector: "app-dataset-view-menu-item",
    templateUrl: "./dataset-view-menu-item.component.html",
    styleUrls: ["./dataset-view-menu-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewMenuItemComponent {
    @Input({ required: true }) public dataTestId: string;
    @Input({ required: true }) public activeLink: boolean;
    @Input({ required: true }) public value: string;
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public icon: string;
    @Input({ required: true }) public datasetLink: string;
    @Input({ required: true }) public adminPrivileges: boolean | null;
    @Input({ required: true }) public visible: boolean;
    @Input() public disabled: MaybeUndefined<boolean>;
    @Input() public showAdminIcon: MaybeUndefined<boolean>;
}
