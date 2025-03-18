/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetFlowsService } from "./../../../flows-component/services/dataset-flows.service";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/common/components/base.component";
import { promiseWithCatch } from "../../../../../common/helpers/app.helpers";
import { ModalService } from "../../../../../common/components/modal/modal.service";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
    DatasetVisibilityInput,
    DatasetVisibilityOutput,
} from "../../../../../api/kamu.graphql.interface";
import { DatasetSettingsService } from "../../services/dataset-settings.service";
import { Observable, shareReplay } from "rxjs";
import { CompactionTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { DatasetResetMode, RenameDatasetFormType, ResetDatasetFormType } from "./dataset-settings-general-tab.types";
import { DatasetCompactionService } from "../../services/dataset-compaction.service";
import { NavigationService } from "src/app/services/navigation.service";
import AppValues from "src/app/common/values/app.values";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetService } from "../../../../dataset.service";

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
    private datasetService = inject(DatasetService);

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

        if (!this.datasetPermissions.permissions.general.canRename) {
            this.renameDatasetForm.disable();
        }

        this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment: string | null) => {
            if (fragment) this.jumpToSection(fragment);
        });
    }

    public jumpToSection(section: string | null) {
        if (section) document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
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

    public get isAllowedDeleteDataset(): boolean {
        return this.datasetPermissions.permissions.general.canDelete;
    }

    public get isRoot(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public get isPrivate(): boolean {
        return this.datasetBasics.visibility.__typename === "PrivateDatasetVisibility";
    }

    public get datasetVisibility(): DatasetVisibilityOutput {
        return this.datasetBasics.visibility;
    }

    public renameDataset(): void {
        const datasetId = this.datasetBasics.id;
        const accountName = this.datasetBasics.owner.accountName;
        const accountId = this.datasetBasics.owner.id;
        this.datasetSettingsService
            .renameDataset({
                accountId,
                accountName,
                datasetId,
                newName: this.datasetNameControl.value as string,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public deleteDataset(): void {
        const datasetId = this.datasetBasics.id;
        const accountId = this.datasetBasics.owner.id;

        this.datasetService
            .hasOutOfSyncPushRemotes(datasetId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((hasOutOfSyncRemotes: boolean) => {
                let message = "";
                if (hasOutOfSyncRemotes) {
                    message += "Dataset is out of sync with its remote(s). ";
                }
                message += "Do you want to delete a dataset?";

                promiseWithCatch(
                    this.modalService.error({
                        title: "Delete",
                        message: message,
                        yesButtonText: "Ok",
                        noButtonText: "Cancel",
                        handler: (ok) => {
                            if (ok) {
                                this.datasetSettingsService
                                    .deleteDataset(accountId, datasetId)
                                    .pipe(takeUntilDestroyed(this.destroyRef))
                                    .subscribe();
                            }
                        },
                    }),
                );
            });
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

    public changeVisibilityDataset(): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Change visibility",
                message: `Do you want to make dataset ${this.isPrivate ? "public" : "private"}?`,
                bigTextBlock: "Ok",
                listDescription: this.isPrivate
                    ? [
                          "It will appear in search results for everyone",
                          "Anyone can read data and metadata",
                          "Anyone can query and download it",
                          "Flow history and logs will be visible to everyone",
                      ]
                    : [
                          "You will decide who else has access",
                          "It will appear in search results only for people with access",
                          "You can control the level of access others have",
                      ],
                warningText: !this.isPrivate
                    ? "Warning: Changing dataset to private may impact the downstream datasets that rely on it."
                    : "",

                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.datasetSettingsService
                            .setVisibility({
                                accountId: this.datasetBasics.owner.id,
                                accountName: this.datasetBasics.owner.accountName,
                                datasetId: this.datasetBasics.id,
                                datasetName: this.datasetBasics.name,
                                visibility: this.setVisibilityParams(),
                            })
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(() => {
                                this.navigationService.navigateToDatasetView({
                                    accountName: this.datasetBasics.owner.accountName,
                                    datasetName: this.datasetBasics.name,
                                    tab: DatasetViewTypeEnum.Overview,
                                });
                            });
                    }
                },
            }),
        );
    }

    private setVisibilityParams(): DatasetVisibilityInput {
        return this.isPrivate
            ? {
                  public: {
                      anonymousAvailable: true,
                  },
              }
            : {
                  private: {},
              };
    }
}
