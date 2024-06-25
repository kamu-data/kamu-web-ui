import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { promiseWithCatch } from "../../../../../common/app.helpers";
import { ModalService } from "../../../../../components/modal/modal.service";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../../../../../api/kamu.graphql.interface";
import { DatasetSettingsService } from "../../services/dataset-settings.service";
import { Observable, shareReplay } from "rxjs";

@Component({
    selector: "app-dataset-settings-general-tab",
    templateUrl: "./dataset-settings-general-tab.component.html",
    styleUrls: ["./dataset-settings-general-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsGeneralTabComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;

    public renameError$: Observable<string>;
    public renameDatasetForm: FormGroup;

    constructor(
        private datasetSettingsService: DatasetSettingsService,
        private fb: FormBuilder,
        private modalService: ModalService,
    ) {
        super();
        this.renameError$ = this.datasetSettingsService.renameDatasetErrorOccurrences.pipe(shareReplay());
        this.renameDatasetForm = this.fb.group({
            datasetName: [
                this.getDatasetInfoFromUrl().datasetName,
                [Validators.required, Validators.pattern(/^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/)],
            ],
        });
    }

    public ngOnInit(): void {
        if (!this.datasetPermissions.permissions.canRename) {
            this.renameDatasetForm.disable();
        }
    }

    public get datasetNameControl(): AbstractControl {
        return this.renameDatasetForm.controls.datasetName;
    }

    public get isDeleteDatasetDisabled(): boolean {
        return !this.datasetPermissions.permissions.canDelete;
    }

    public renameDataset(): void {
        const datasetId = this.datasetBasics.id;
        const accountName = this.datasetBasics.owner.accountName;
        const accountId = this.datasetBasics.owner.id;
        this.trackSubscription(
            this.datasetSettingsService
                .renameDataset({
                    accountId,
                    accountName,
                    datasetId,
                    newName: this.datasetNameControl.value as string,
                })
                .subscribe(),
        );
    }

    public deleteDataset(): void {
        const datasetId = this.datasetBasics.id;
        const accountId = this.datasetBasics.owner.id;
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: "Do you want to delete a dataset?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.trackSubscription(
                            this.datasetSettingsService.deleteDataset(accountId, datasetId).subscribe(),
                        );
                    }
                },
            }),
        );
    }

    public changeName(): void {
        this.datasetSettingsService.resetRenameError();
    }
}
