import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Component({
    selector: "app-final-yaml-modal",
    templateUrl: "./final-yaml-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalYamlModalComponent extends BaseComponent {
    @Input({ required: true }) public yamlTemplate: string;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public enabledSaveBtn = true;

    public activeModal = inject(NgbActiveModal);
    private datasetCommitService = inject(DatasetCommitService);
    private loggedUserService = inject(LoggedUserService);

    public saveEvent(): void {
        this.trackSubscription(
            this.datasetCommitService
                .commitEventToDataset({
                    accountId: this.loggedUserService.currentlyLoggedInUser.id,
                    accountName: this.datasetInfo.accountName,
                    datasetName: this.datasetInfo.datasetName,
                    event: this.yamlTemplate,
                })
                .subscribe(),
        );
        this.activeModal.close(this.yamlTemplate);
    }
}
