import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatasetSettingsService } from "./services/dataset-settings.service";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { BaseComponent } from "src/app/common/base.component";
import { ModalService } from "src/app/components/modal/modal.service";
import { Observable, shareReplay } from "rxjs";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public renameError$: Observable<string>;
    public renameDatasetForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private datasetSettingsService: DatasetSettingsService,
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
        this.trackSubscription(
            this.datasetSettingsService
                .renameDataset(accountName, datasetId, this.datasetNameControl.value as string)
                .subscribe(),
        );
    }

    public deleteDataset(): void {
        const datasetId = this.datasetBasics.id;
        const accountName = this.datasetBasics.owner.accountName;
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: "Do you want to delete a dataset?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.trackSubscription(
                            this.datasetSettingsService.deleteDataset(accountName, datasetId).subscribe(),
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
