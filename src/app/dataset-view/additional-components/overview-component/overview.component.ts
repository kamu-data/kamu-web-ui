/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EditLicenseModalComponent } from "./components/edit-license-modal/edit-license-modal.component";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    DatasetAccessRole,
    DatasetCurrentInfoFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
} from "../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../../../api/kamu.graphql.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { DataRow, DatasetSchema } from "src/app/interface/dataset.interface";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EditDetailsModalComponent } from "./components/edit-details-modal/edit-details-modal.component";
import { EditWatermarkModalComponent } from "./components/edit-watermark-modal/edit-watermark-modal.component";
import { DatasetFlowsService } from "../flows-component/services/dataset-flows.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { AddDataModalComponent } from "./components/add-data-modal/add-data-modal.component";
import { Observable } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { isNil, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import AppValues from "src/app/common/values/app.values";
import { FileUploadService } from "src/app/services/file-upload.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetCollaborationsService } from "../dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-collaborations.service";

@Component({
    selector: "app-overview",
    templateUrl: "overview.component.html",
    styleUrls: ["./overview.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;
    @Output() public toggleReadmeViewEmit = new EventEmitter<null>();
    @Output() public selectTopicEmit = new EventEmitter<string>();
    public editingReadme = false;
    public droppedFile: File;
    public uploadFileLoading$: Observable<boolean>;
    public role$: Observable<MaybeNull<DatasetAccessRole>>;
    public readonly UPLOAD_FILE_IMAGE = AppValues.UPLOAD_FILE_IMAGE;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly URL_PARAM_ADD_PUSH_SOURCE = ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE;

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };

    private datasetSubsService = inject(DatasetSubscriptionsService);
    private navigationService = inject(NavigationService);
    private ngbModalService = inject(NgbModal);
    private datasetFlowsService = inject(DatasetFlowsService);
    private fileUploadService = inject(FileUploadService);
    private configService = inject(AppConfigService);
    private modalService = inject(ModalService);
    private loggedUserService = inject(LoggedUserService);
    private datasetCollaborationsService = inject(DatasetCollaborationsService);

    public ngOnInit(): void {
        this.role$ = this.datasetCollaborationsService.getRoleByDatasetId(this.datasetBasics.id);
        this.uploadFileLoading$ = this.fileUploadService.isUploadFile;
        this.datasetSubsService.overviewChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((overviewUpdate: OverviewUpdate) => {
                this.currentState = {
                    schema: overviewUpdate.schema,
                    data: overviewUpdate.content,
                    size: overviewUpdate.size,
                    overview: overviewUpdate.overview,
                };
            });
    }

    public showWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

    public selectTopic(topicName: string): void {
        this.selectTopicEmit.emit(topicName);
    }

    public get metadataFragmentBlock(): MaybeUndefined<MetadataBlockFragment> {
        return this.currentState ? this.currentState.overview.metadata.chain.blocks.nodes[0] : undefined;
    }

    public get canEditDatasetInfo(): boolean {
        if (this.hasDatasetInfo) {
            return this.datasetPermissions.permissions.metadata.canCommit;
        } else {
            return false;
        }
    }

    public get enableScheduling(): boolean {
        return this.configService.featureFlags.enableScheduling;
    }

    public get canAddDatasetInfo(): boolean {
        if (!this.hasDatasetInfo) {
            return this.datasetPermissions.permissions.metadata.canCommit && !isNil(this.currentState);
        } else {
            return false;
        }
    }

    public get hasDatasetInfo(): boolean {
        if (this.currentState) {
            const currentInfo: DatasetCurrentInfoFragment = this.currentState.overview.metadata.currentInfo;
            return (
                !isNil(currentInfo.description) ||
                (!isNil(currentInfo.keywords) && Boolean(currentInfo.keywords && currentInfo.keywords.length))
            );
        } else {
            return false;
        }
    }

    public get canAddSetPollingSource(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return (
                !this.currentState.overview.metadata.currentPollingSource &&
                this.datasetBasics.kind === DatasetKind.Root &&
                !this.currentState.overview.metadata.currentPushSources.length
            );
        } else {
            return false;
        }
    }

    public get canAddPushSource(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return (
                !this.currentState.overview.metadata.chain.blocks.nodes.filter(
                    (item) => item.event.__typename === "AddPushSource",
                ).length && this.datasetBasics.kind === DatasetKind.Root
            );
        } else {
            return false;
        }
    }

    public get canAddSetTransform(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return (
                !this.currentState.overview.metadata.currentTransform &&
                this.datasetBasics.kind === DatasetKind.Derivative
            );
        } else {
            return false;
        }
    }

    public get canAddReadme(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return !this.currentState.overview.metadata.currentReadme && !this.editingReadme;
        } else {
            return false;
        }
    }

    public get canEditReadme(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return !isNil(this.currentState.overview.metadata.currentReadme);
        } else {
            return false;
        }
    }

    public get canAddLicense(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return isNil(this.currentState.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public get canEditLicense(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return !isNil(this.currentState.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public get canAddWatermark(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return !this.hasWatermark && this.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public get canEditWatermark(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.metadata.canCommit) {
            return this.hasWatermark && this.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public get canSchedule(): boolean {
        return this.datasetPermissions.permissions.flows.canRun;
    }

    public get canRefresh(): boolean {
        return this.hasSetPollingSource || this.hasCurrentTransform;
    }

    public get isUserLogged(): boolean {
        return this.loggedUserService.isAuthenticated;
    }

    public get visibleUpdateButton(): boolean {
        return this.isUserLogged && this.enableScheduling && this.canSchedule;
    }

    public get hasSetPollingSource(): boolean {
        return !isNil(this.currentState?.overview.metadata.currentPollingSource);
    }

    public get showDragAndDropBlock(): boolean {
        return !this.hasSetPollingSource && this.datasetBasics.kind === DatasetKind.Root;
    }

    public get hasCurrentTransform(): boolean {
        return !isNil(this.currentState?.overview.metadata.currentTransform);
    }

    private get hasWatermark(): boolean {
        return !isNil(this.currentState?.overview.metadata.currentWatermark);
    }

    public get isPrivate(): boolean {
        return this.datasetBasics.visibility.__typename === "PrivateDatasetVisibility";
    }

    public get showAddDataButton(): boolean {
        if (Boolean(this.currentState?.data.length) && this.isUserLogged) {
            return (
                (!this.currentState?.overview.metadata.currentPollingSource &&
                    this.datasetBasics.kind === DatasetKind.Root) ||
                (!this.currentState?.overview.metadata.currentTransform &&
                    this.datasetBasics.kind === DatasetKind.Derivative)
            );
        } else {
            return false;
        }
    }

    public openInformationModal() {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditDetailsModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditDetailsModalComponent;
        modalRefInstance.currentState = this.currentState;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public openLicenseModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditLicenseModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditLicenseModalComponent;
        modalRefInstance.currentState = this.currentState;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public openWatermarkModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditWatermarkModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditWatermarkModalComponent;
        modalRefInstance.currentWatermark = this.currentState?.overview.metadata.currentWatermark;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public onAddReadme(): void {
        this.editingReadme = true;
    }

    public refreshNow(): void {
        this.datasetFlowsService
            .datasetTriggerFlow({
                datasetId: this.datasetBasics.id,
                datasetFlowType:
                    this.datasetBasics.kind === DatasetKind.Root
                        ? DatasetFlowType.Ingest
                        : DatasetFlowType.ExecuteTransform,
                flowRunConfiguration: {
                    ingest: {
                        fetchUncacheable: true,
                    },
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    setTimeout(() => {
                        this.navigationService.navigateToDatasetView({
                            accountName: this.datasetBasics.owner.accountName,
                            datasetName: this.datasetBasics.name,
                            tab: DatasetViewTypeEnum.Flows,
                        });
                    }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                }
            });
    }

    public addData(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(AddDataModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddDataModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public onFileDropped(files: FileList): void {
        this.droppedFile = files[0];
        const fileSizeMb = this.droppedFile.size * Math.pow(10, -6);
        if (fileSizeMb <= this.configService.ingestUploadFileLimitMb) {
            this.fileUploadService
                .uploadFile(this.droppedFile, this.datasetBasics)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        } else {
            promiseWithCatch(
                this.modalService.warning({
                    title: "Warning",
                    message: `Maximum file size ${this.configService.ingestUploadFileLimitMb} MB`,
                    yesButtonText: "Ok",
                }),
            );
        }
    }
}
