import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatasetSettingsService } from "./services/dataset-settings.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { BaseComponent } from "src/app/common/base.component";
import { ModalService } from "src/app/components/modal/modal.service";
import { Observable, shareReplay } from "rxjs";

@Component({
    selector: "app-settings-tab",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabComponent extends BaseComponent {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    public renameError$: Observable<string>;
    public renameDatasetForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private datasetSettingsService: DatasetSettingsService,
        private modalService: ModalService,
    ) {
        super();
        this.renameError$ = this.datasetSettingsService.onErrorRenameDatasetChanges.pipe(shareReplay());
        this.renameDatasetForm = this.fb.group({
            datasetName: [
                this.getDatasetInfoFromUrl().datasetName,
                // eslint-disable-next-line @typescript-eslint/unbound-method
                [Validators.required, Validators.pattern(/^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/)],
            ],
        });
    }

    public get datasetName() {
        return this.renameDatasetForm.get("datasetName");
    }

    public renameDataset(): void {
        if (this.datasetBasics) {
            const datasetId = this.datasetBasics.id;
            const accountName = this.getDatasetInfoFromUrl().accountName;
            this.trackSubscription(
                this.datasetSettingsService
                    .renameDataset(accountName, datasetId, this.datasetName?.value as string)
                    .subscribe(),
            );
        }
    }

    public deleteDataset(): void {
        if (this.datasetBasics) {
            const datasetId = this.datasetBasics.id;
            promiseWithCatch(
                this.modalService.error({
                    title: "Delete",
                    message: "Do you want to delete a dataset?",
                    yesButtonText: "Ok",
                    noButtonText: "Cancel",
                    handler: (ok) => {
                        if (ok) {
                            this.trackSubscription(this.datasetSettingsService.deleteDataset(datasetId).subscribe());
                        }
                    },
                }),
            );
        }
    }

    public changeName(): void {
        this.datasetSettingsService.resetRenameError();
    }
}
