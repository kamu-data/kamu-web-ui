import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { Observable } from "rxjs";
import { DatasetEndpoints } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import { Clipboard } from "@angular/cdk/clipboard";
import { DataAccessMenuItem, dataAccessMenuOptions, DataAccessTabsEnum } from "./data-access-modal.model";
import { changeCopyIcon } from "src/app/common/app.helpers";

@Component({
    selector: "app-data-access-modal",
    templateUrl: "./data-access-modal.component.html",
    styleUrls: ["./data-access-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessModalComponent {
    @Input({ required: true }) protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;

    private clipboard = inject(Clipboard);
    public accessDataOptions: DataAccessMenuItem[] = dataAccessMenuOptions;
    public activeTab: DataAccessTabsEnum = DataAccessTabsEnum.LINK;
    public readonly dataAccessTabsEnum: typeof DataAccessTabsEnum = DataAccessTabsEnum;

    public navigateToSection(section: DataAccessTabsEnum): void {
        this.activeTab = section;
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }
}
