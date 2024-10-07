import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { ElementVisibilityMode } from "src/app/services/elements-view.service";

@Component({
    selector: "app-dataset-view-menu-item",
    templateUrl: "./dataset-view-menu-item.component.html",
    styleUrls: ["./dataset-view-menu-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewMenuItemComponent {
    @Input({ required: true }) public dataTestId: string;
    @Input({ required: true }) public activeLink: boolean;
    @Input({ required: true }) public value: DatasetViewTypeEnum;
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public icon: string;
    @Input({ required: true }) public tab: MaybeNull<DatasetViewTypeEnum>;
    @Input({ required: true }) public viewMode: ElementVisibilityMode;
    @Input({ required: true }) datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public visible: boolean;
    @Input() public disabled: MaybeUndefined<boolean>;
    @Input() public showAdminIcon: MaybeUndefined<boolean>;

    public readonly ElementVisibilityMode: typeof ElementVisibilityMode = ElementVisibilityMode;

    public get datasetLink(): string {
        return `/${this.datasetBasics.owner.accountName}/${this.datasetBasics.name}/`;
    }
}
