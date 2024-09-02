import { DatasetFlowsService } from "./../../../flows-component/services/dataset-flows.service";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { promiseWithCatch } from "../../../../../common/app.helpers";
import { ModalService } from "../../../../../components/modal/modal.service";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
} from "../../../../../api/kamu.graphql.interface";
import { DatasetSettingsService } from "../../services/dataset-settings.service";
import { Observable, shareReplay } from "rxjs";
import { CompactionTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { DatasetResetMode, RenameDatasetFormType, ResetDatasetFormType } from "./dataset-settings-general-tab.types";
import { DatasetCompactionService } from "../../services/dataset-compaction.service";
import { NavigationService } from "src/app/services/navigation.service";
import AppValues from "src/app/common/app.values";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-dataset-settings-general-tab",
    templateUrl: "./dataset-settings-general-tab.component.html",
    styleUrls: ["./dataset-settings-general-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsGeneralTabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;

    public renameError$: Observable<string>;
    public renameDatasetForm: FormGroup<RenameDatasetFormType>;
    public resetDatasetForm: FormGroup<ResetDatasetFormType>;

    public readonly FLATTEN_METADATA_TOOLTIP = CompactionTooltipsTexts.RESET_BLOCK_FLATTEN_METADATA;
    public readonly SEED_TOOLTIP = CompactionTooltipsTexts.RESET_TO_SEED;
    public readonly RECURSIVE_TOOLTIP = CompactionTooltipsTexts.RESET_BLOCK_RECURSIVE;
    public readonly DatasetResetMode: typeof DatasetResetMode = DatasetResetMode;

    private datasetSettingsService = inject(DatasetSettingsService);
    private fb = inject(FormBuilder);
    private modalService = inject(ModalService);
    private datasetCompactionService = inject(DatasetCompactionService);
    private flowsService = inject(DatasetFlowsService);
    private navigationService = inject(NavigationService);

    public ngOnInit(): void {
        this.renameError$ = this.datasetSettingsService.renameDatasetErrorOccurrences.pipe(shareReplay());
        this.renameDatasetForm = this.fb.nonNullable.group({
            datasetName: [
                this.getDatasetInfoFromUrl().datasetName,
                [Validators.required, Validators.pattern(/^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/)],
            ],
        });

        this.resetDatasetForm = this.fb.nonNullable.group({
            mode: [DatasetResetMode.RESET_TO_SEED],
            recursive: [false],
        });

        if (!this.datasetPermissions.permissions.canRename) {
            this.renameDatasetForm.disable();
        }
    }

    public get datasetNameControl(): AbstractControl {
        return this.renameDatasetForm.controls.datasetName;
    }

    public get recursiveControl(): FormControl<boolean> {
        return this.resetDatasetForm.controls.recursive;
    }

    public get modeControl(): FormControl<DatasetResetMode> {
        return this.resetDatasetForm.controls.mode;
    }

    public get isDeleteDatasetDisabled(): boolean {
        return !this.datasetPermissions.permissions.canDelete;
    }

    public get isRoot(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
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

    public resetDataset(): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Reset dataset",
                message: "Do you want to reset a dataset?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        const mode = this.modeControl.value;
                        switch (mode) {
                            case DatasetResetMode.RESET_TO_SEED: {
                                this.datasetCompactionService
                                    .resetToSeed({
                                        accountId: this.datasetBasics.owner.id,
                                        datasetId: this.datasetBasics.id,
                                        datasetFlowType: DatasetFlowType.Reset,
                                        flowRunConfiguration: {
                                            reset: {
                                                mode: {
                                                    toSeed: {
                                                        dummy: "",
                                                    },
                                                },
                                                recursive: this.recursiveControl.value,
                                            },
                                        },
                                    })
                                    .pipe(takeUntilDestroyed(this.destroyRef))
                                    .subscribe((result: boolean) => {
                                        if (result) {
                                            setTimeout(() => {
                                                this.navigationService.navigateToDatasetView({
                                                    accountName: this.datasetBasics.owner.accountName,
                                                    datasetName: this.datasetBasics.name,
                                                    tab: DatasetViewTypeEnum.Flows,
                                                });
                                            }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                                        }
                                    });
                                break;
                            }
                            case DatasetResetMode.RESET_METADATA_ONLY: {
                                this.flowsService
                                    .datasetTriggerFlow({
                                        datasetId: this.datasetBasics.id,
                                        datasetFlowType: DatasetFlowType.HardCompaction,
                                        flowRunConfiguration: {
                                            compaction: {
                                                metadataOnly: {
                                                    recursive: this.recursiveControl.value,
                                                },
                                            },
                                        },
                                    })
                                    .pipe(takeUntilDestroyed(this.destroyRef))
                                    .subscribe((result: boolean) => {
                                        if (result) {
                                            setTimeout(() => {
                                                this.navigationService.navigateToDatasetView({
                                                    accountName: this.datasetBasics.owner.accountName,
                                                    datasetName: this.datasetBasics.name,
                                                    tab: DatasetViewTypeEnum.Flows,
                                                });
                                            }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                                        }
                                    });
                                break;
                            }
                            /* istanbul ignore next */
                            default:
                                throw new Error("Unsupported reset mode");
                        }
                    }
                },
            }),
        );
    }

    public changeName(): void {
        this.datasetSettingsService.resetRenameError();
    }
}
