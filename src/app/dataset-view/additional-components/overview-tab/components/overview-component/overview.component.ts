import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from "@angular/core";

import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import _ from "lodash";

import { combineLatest, map, Observable } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { promiseWithCatch } from "src/app/common/app.helpers";
import AppValues from "src/app/common/app.values";
import { FileUploadService } from "src/app/services/file-upload.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseDatasetDataComponent } from "src/app/common/base-dataset-data.component";
import { DatasetCurrentInfoFragment, DatasetKind, DatasetPermissionsFragment, DatasetFlowType, DatasetBasicsFragment, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "../../../flows-component/services/dataset-flows.service";
import { AddDataModalComponent } from "../add-data-modal/add-data-modal.component";
import { EditDetailsModalComponent } from "../edit-details-modal/edit-details-modal.component";
import { EditLicenseModalComponent } from "../edit-license-modal/edit-license-modal.component";
import { EditWatermarkModalComponent } from "../edit-watermark-modal/edit-watermark-modal.component";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-overview",
    templateUrl: "overview.component.html",
    styleUrls: ["./overview.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends BaseDatasetDataComponent implements OnInit {
    @Output() toggleReadmeViewEmit = new EventEmitter<null>();
    @Output() selectTopicEmit = new EventEmitter<string>();
    public editingReadme = false;
    public droppedFile: File;
    public uploadFileLoading$: Observable<boolean>;
    public readonly UPLOAD_FILE_IMAGE = AppValues.UPLOAD_FILE_IMAGE;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly URL_PARAM_ADD_PUSH_SOURCE = ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE;

    private ngbModalService = inject(NgbModal);
    private datasetFlowsService = inject(DatasetFlowsService);
    private fileUploadService = inject(FileUploadService);
    private configService = inject(AppConfigService);
    private loggedUserService = inject(LoggedUserService);
    public datasetOverviewTabData$: Observable<DatasetOverviewTabData>;

    public ngOnInit(): void {
        this.datasetOverviewTabData$ = combineLatest([
            this.datasetService.datasetChanges,
            this.datasetSubsService.permissionsChanges,
            this.datasetSubsService.overviewChanges,
        ]).pipe(
            map(([datasetBasics, datasetPermissions, overviewUpdate]) => {
                return {
                    datasetBasics,
                    datasetPermissions,
                    overviewUpdate,
                };
            }),
            takeUntilDestroyed(this.destroyRef),
        );

        this.uploadFileLoading$ = this.fileUploadService.isUploadFile;
    }

    public showWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

    public selectTopic(topicName: string): void {
        this.selectTopicEmit.emit(topicName);
    }

    public metadataFragmentBlock(overviewUpdate: OverviewUpdate): MaybeUndefined<MetadataBlockFragment> {
        return overviewUpdate.overview.metadata.chain.blocks.nodes[0] ?? undefined;
    }

    public canEditDatasetInfo(data: DatasetOverviewTabData): boolean {
        if (this.hasDatasetInfo(data.overviewUpdate)) {
            return data.datasetPermissions.permissions.canCommit;
        } else {
            return false;
        }
    }

    public get enableScheduling(): boolean {
        return this.configService.featureFlags.enableScheduling;
    }

    public canAddDatasetInfo(data: DatasetOverviewTabData): boolean {
        if (!this.hasDatasetInfo(data.overviewUpdate)) {
            return data.datasetPermissions.permissions.canCommit && !_.isNil(data.overviewUpdate);
        } else {
            return false;
        }
    }

    public hasDatasetInfo(overviewUpdate: MaybeNull<OverviewUpdate>): boolean {
        if (overviewUpdate) {
            const currentInfo: DatasetCurrentInfoFragment = overviewUpdate.overview.metadata.currentInfo;
            return (
                !_.isNil(currentInfo.description) || (!_.isNil(currentInfo.keywords) && currentInfo.keywords.length > 0)
            );
        } else {
            return false;
        }
    }

    public canAddSetPollingSource(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return (
                !data.overviewUpdate.overview.metadata.currentPollingSource &&
                data.datasetBasics.kind === DatasetKind.Root &&
                !data.overviewUpdate.overview.metadata.currentPushSources.length
            );
        } else {
            return false;
        }
    }

    public canAddPushSource(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return (
                !data.overviewUpdate.overview.metadata.chain.blocks.nodes.filter(
                    (item) => item.event.__typename === "AddPushSource",
                ).length && data.datasetBasics.kind === DatasetKind.Root
            );
        } else {
            return false;
        }
    }

    public canAddSetTransform(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return (
                !data.overviewUpdate.overview.metadata.currentTransform &&
                data.datasetBasics.kind === DatasetKind.Derivative
            );
        } else {
            return false;
        }
    }

    public canAddReadme(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return !data.overviewUpdate.overview.metadata.currentReadme && !this.editingReadme;
        } else {
            return false;
        }
    }

    public canEditReadme(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return !_.isNil(data.overviewUpdate.overview.metadata.currentReadme);
        } else {
            return false;
        }
    }

    public canAddLicense(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return _.isNil(data.overviewUpdate.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public canEditLicense(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return !_.isNil(data.overviewUpdate.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public canAddWatermark(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return !this.hasWatermark && data.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public canEditWatermark(data: DatasetOverviewTabData): boolean {
        if (data.overviewUpdate && data.datasetPermissions.permissions.canCommit) {
            return this.hasWatermark(data) && data.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public canSchedule(data: DatasetPermissionsFragment): boolean {
        return data.permissions.canSchedule;
    }

    public canRefresh(data: DatasetOverviewTabData): boolean {
        return this.hasSetPollingSource(data) || this.hasCurrentTransform(data);
    }

    public get isUserLogged(): boolean {
        return this.loggedUserService.isAuthenticated;
    }

    public get visibleUpdateButton(): boolean {
        return this.isUserLogged && this.enableScheduling;
    }

    public hasSetPollingSource(data: DatasetOverviewTabData): boolean {
        return !_.isNil(data.overviewUpdate?.overview.metadata.currentPollingSource);
    }

    public showDragAndDropBlock(data: DatasetOverviewTabData): boolean {
        return !this.hasSetPollingSource(data) && data.datasetBasics.kind === DatasetKind.Root;
    }

    public hasCurrentTransform(data: DatasetOverviewTabData): boolean {
        return !_.isNil(data.overviewUpdate.overview.metadata.currentTransform);
    }

    private hasWatermark(data: DatasetOverviewTabData): boolean {
        return !_.isNil(data.overviewUpdate.overview.metadata.currentWatermark);
    }

    public showAddDataButton(data: DatasetOverviewTabData): boolean {
        if (Boolean(data.overviewUpdate.content.length) && this.isUserLogged) {
            return (
                (!data.overviewUpdate?.overview.metadata.currentPollingSource &&
                    data.datasetBasics.kind === DatasetKind.Root) ||
                (!data.overviewUpdate?.overview.metadata.currentTransform &&
                    data.datasetBasics.kind === DatasetKind.Derivative)
            );
        } else {
            return false;
        }
    }

    public openInformationModal(data: DatasetOverviewTabData) {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditDetailsModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditDetailsModalComponent;
        modalRefInstance.currentState = {
            schema: data.overviewUpdate.schema,
            data: data.overviewUpdate.content,
            overview: data.overviewUpdate.overview,
            size: data.overviewUpdate.size,
        };
        modalRefInstance.datasetBasics = data.datasetBasics;
    }

    public openLicenseModal(data: DatasetOverviewTabData): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditLicenseModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditLicenseModalComponent;
        modalRefInstance.currentState = {
            schema: data.overviewUpdate.schema,
            data: data.overviewUpdate.content,
            overview: data.overviewUpdate.overview,
            size: data.overviewUpdate.size,
        };
        modalRefInstance.datasetBasics = data.datasetBasics;
    }

    public openWatermarkModal(data: DatasetOverviewTabData): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditWatermarkModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditWatermarkModalComponent;
        modalRefInstance.currentWatermark = data.overviewUpdate?.overview.metadata.currentWatermark;
        modalRefInstance.datasetBasics = data.datasetBasics;
    }

    public onAddReadme(): void {
        this.editingReadme = true;
    }

    public refreshNow(data: DatasetOverviewTabData): void {
        this.datasetFlowsService
            .datasetTriggerFlow({
                datasetId: data.datasetBasics.id,
                datasetFlowType:
                    data.datasetBasics.kind === DatasetKind.Root
                        ? DatasetFlowType.Ingest
                        : DatasetFlowType.ExecuteTransform,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    setTimeout(() => {
                        this.navigationService.navigateToDatasetView({
                            accountName: data.datasetBasics.owner.accountName,
                            datasetName: data.datasetBasics.name,
                            tab: DatasetViewTypeEnum.Flows,
                        });
                    }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                }
            });
    }

    public addData(data: DatasetOverviewTabData): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(AddDataModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddDataModalComponent;
        modalRefInstance.datasetBasics = data.datasetBasics;
    }

    public onFileDropped(files: FileList, datasetBasics: DatasetBasicsFragment): void {
        this.droppedFile = files[0];
        const fileSizeMb = this.droppedFile.size * Math.pow(10, -6);
        if (fileSizeMb <= this.configService.ingestUploadFileLimitMb) {
            this.fileUploadService
                .uploadFile(this.droppedFile, datasetBasics)
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
