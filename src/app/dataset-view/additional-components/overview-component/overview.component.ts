import { EditLicenseModalComponent } from "./components/edit-license-modal/edit-license-modal.component";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    DatasetCurrentInfoFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
} from "../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../../../api/kamu.graphql.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { DataRow, DatasetSchema } from "src/app/interface/dataset.interface";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EditDetailsModalComponent } from "./components/edit-details-modal/edit-details-modal.component";
import { EditWatermarkModalComponent } from "./components/edit-watermark-modal/edit-watermark-modal.component";
import _ from "lodash";
import { DatasetFlowsService } from "../flows-component/services/dataset-flows.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { AddDataModalComponent } from "./components/add-data-modal/add-data-modal.component";

import { Observable } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { ModalService } from "src/app/components/modal/modal.service";
import AppValues from "src/app/common/app.values";
import { FileUploadService } from "src/app/services/file-upload.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Component({
    selector: "app-overview",
    templateUrl: "overview.component.html",
    styleUrls: ["./overview.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    @Output() toggleReadmeViewEmit = new EventEmitter<null>();
    @Output() selectTopicEmit = new EventEmitter<string>();
    public editingReadme = false;
    public droppedFile: File;
    public uploadFileLoading$: Observable<boolean>;
    public readonly UPLOAD_FILE_IMAGE = AppValues.UPLOAD_FILE_IMAGE;

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };

    constructor(
        private datasetSubsService: DatasetSubscriptionsService,
        private navigationService: NavigationService,
        private ngbModalService: NgbModal,
        private datasetFlowsService: DatasetFlowsService,
        private fileUploadService: FileUploadService,
        private configService: AppConfigService,
        private modalService: ModalService,
        private loggedUserService: LoggedUserService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.uploadFileLoading$ = this.fileUploadService.isUploadFile;
        this.trackSubscription(
            this.datasetSubsService.overviewChanges.subscribe((overviewUpdate: OverviewUpdate) => {
                this.currentState = {
                    schema: overviewUpdate.schema,
                    data: overviewUpdate.content,
                    size: overviewUpdate.size,
                    overview: overviewUpdate.overview,
                };
            }),
        );
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
            return this.datasetPermissions.permissions.canCommit;
        } else {
            return false;
        }
    }

    public get canAddDatasetInfo(): boolean {
        if (!this.hasDatasetInfo) {
            return this.datasetPermissions.permissions.canCommit && !_.isNil(this.currentState);
        } else {
            return false;
        }
    }

    public get hasDatasetInfo(): boolean {
        if (this.currentState) {
            const currentInfo: DatasetCurrentInfoFragment = this.currentState.overview.metadata.currentInfo;
            return (
                !_.isNil(currentInfo.description) || (!_.isNil(currentInfo.keywords) && currentInfo.keywords.length > 0)
            );
        } else {
            return false;
        }
    }

    public get canAddSetPollingSource(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
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
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
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
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return (
                !this.currentState.overview.metadata.currentTransform &&
                this.datasetBasics.kind === DatasetKind.Derivative
            );
        } else {
            return false;
        }
    }

    public get canAddReadme(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return !this.currentState.overview.metadata.currentReadme && !this.editingReadme;
        } else {
            return false;
        }
    }

    public get canEditReadme(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return !_.isNil(this.currentState.overview.metadata.currentReadme);
        } else {
            return false;
        }
    }

    public get canAddLicense(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return _.isNil(this.currentState.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public get canEditLicense(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return !_.isNil(this.currentState.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public get canAddWatermark(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return !this.hasWatermark && this.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public get canEditWatermark(): boolean {
        if (this.currentState && this.datasetPermissions.permissions.canCommit) {
            return this.hasWatermark && this.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public get canSchedule(): boolean {
        return this.datasetPermissions.permissions.canSchedule;
    }

    public get canRefresh(): boolean {
        return this.hasSetPollingSource || this.hasCurrentTransform;
    }

    public get isUserLogged(): boolean {
        return this.loggedUserService.isAuthenticated;
    }

    public get hasSetPollingSource(): boolean {
        return !_.isNil(this.currentState?.overview.metadata.currentPollingSource);
    }

    public get showDragAndDropBlock(): boolean {
        return !this.hasSetPollingSource && this.datasetBasics.kind === DatasetKind.Root;
    }

    public get hasCurrentTransform(): boolean {
        return !_.isNil(this.currentState?.overview.metadata.currentTransform);
    }

    private get hasWatermark(): boolean {
        return !_.isNil(this.currentState?.overview.metadata.currentWatermark);
    }

    public get showAddDataButton(): boolean {
        return (
            Boolean(this.currentState?.data.length) &&
            this.isUserLogged &&
            !this.currentState?.overview.metadata.currentPollingSource &&
            this.datasetBasics.kind === DatasetKind.Root
        );
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

    public navigateToAddPollingSource(): void {
        this.navigationService.navigateToAddPollingSource({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public navigateToAddPushSource(): void {
        this.navigationService.navigateToAddPushSource({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public navigateToSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public onAddReadme(): void {
        this.editingReadme = true;
    }

    public refreshNow(): void {
        this.trackSubscription(
            this.datasetFlowsService
                .datasetTriggerFlow({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType:
                        this.datasetBasics.kind === DatasetKind.Root
                            ? DatasetFlowType.Ingest
                            : DatasetFlowType.ExecuteTransform,
                })
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
                }),
        );
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
            this.trackSubscription(this.fileUploadService.uploadFile(this.droppedFile, this.datasetBasics).subscribe());
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
