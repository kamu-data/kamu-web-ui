import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { Observable } from "rxjs";
import { DatasetBasicsFragment, DatasetEndpoints, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import { Clipboard } from "@angular/cdk/clipboard";
import { DataAccessMenuItem, dataAccessMenuOptions, DataAccessTabsEnum } from "./data-access-modal.model";
import { changeCopyIcon } from "src/app/common/app.helpers";
import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-data-access-modal",
    templateUrl: "./data-access-modal.component.html",
    styleUrls: ["./data-access-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessModalComponent {
    @Input({ required: true }) protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;
    @Input({ required: true }) datasetBasics: DatasetBasicsFragment;

    private clipboard = inject(Clipboard);
    private appConfigService = inject(AppConfigService);
    private loggedUserService = inject(LoggedUserService);
    public activeModal = inject(NgbActiveModal);

    public accessDataOptions: DataAccessMenuItem[] = dataAccessMenuOptions;
    public activeTab: DataAccessTabsEnum = DataAccessTabsEnum.LINK;
    public readonly dataAccessTabsEnum: typeof DataAccessTabsEnum = DataAccessTabsEnum;
    public readonly datasetSettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly datasetViewType: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public navigateToSection(section: DataAccessTabsEnum): void {
        this.activeTab = section;
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }

    public get showApiTokensLink(): boolean {
        return (
            this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
            this.loggedUserService.isAuthenticated &&
            this.datasetBasics.kind === DatasetKind.Root
        );
    }
}
