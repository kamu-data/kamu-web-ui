/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EditLicenseModalComponent } from "./components/edit-license-modal/edit-license-modal.component";
import { DatasetAccessRole, DatasetCurrentInfoFragment, DatasetKind } from "../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { MetadataBlockFragment } from "../../../api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { NgbModal, NgbModalRef, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { EditDetailsModalComponent } from "./components/edit-details-modal/edit-details-modal.component";
import { EditWatermarkModalComponent } from "./components/edit-watermark-modal/edit-watermark-modal.component";
import { DatasetFlowsService } from "../flows-component/services/dataset-flows.service";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { AddDataModalComponent } from "./components/add-data-modal/add-data-modal.component";
import { from, Observable, take } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { isNil, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import AppValues from "src/app/common/values/app.values";
import { FileUploadService } from "src/app/services/file-upload.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetCollaborationsService } from "../dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-collaborations.service";
import { BaseDatasetDataComponent } from "src/app/common/components/base-dataset-data.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DisplaySizePipe } from "../../../common/pipes/display-size.pipe";
import { DisplayTimeComponent } from "../../../common/components/display-time/display-time.component";
import { DisplayHashComponent } from "../../../common/components/display-hash/display-hash.component";
import { ReadmeSectionComponent } from "./components/readme-section/readme-section.component";
import { DragAndDropDirective } from "../../../common/directives/drag-and-drop.directive";
import { DynamicTableComponent } from "../../../common/components/dynamic-table/dynamic-table.component";
import { OverviewHistorySummaryHeaderComponent } from "./components/overview-history-summary-header/overview-history-summary-header.component";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "../../../common/directives/feature-flag.directive";
import { MatChipsModule } from "@angular/material/chips";
import { NgIf, NgFor, AsyncPipe, DecimalPipe, TitleCasePipe } from "@angular/common";
import { ColumnDescriptor } from "src/app/common/components/dynamic-table/dynamic-table.interface";
import { DataSchemaField } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-overview",
    templateUrl: "overview.component.html",
    styleUrls: ["./overview.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        DecimalPipe,
        TitleCasePipe,
        NgIf,
        NgFor,
        RouterLink,

        //-----//
        MatChipsModule,
        MatIconModule,
        NgbTooltip,

        //-----//
        FeatureFlagDirective,
        OverviewHistorySummaryHeaderComponent,
        DynamicTableComponent,
        DragAndDropDirective,
        ReadmeSectionComponent,
        DisplayHashComponent,
        DisplaySizePipe,
        DisplayTimeComponent,
    ],
})
export class OverviewComponent extends BaseDatasetDataComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_OVERVIEW_KEY) public datasetOverviewTabData: DatasetOverviewTabData;
    public editingReadme = false;
    public droppedFile: File;
    public uploadFileLoading$: Observable<boolean>;
    public role$: Observable<MaybeNull<DatasetAccessRole>>;
    public readonly UPLOAD_FILE_IMAGE = AppValues.UPLOAD_FILE_IMAGE;
    public readonly URL_PARAM_ADD_POLLING_SOURCE = ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE;
    public readonly URL_PARAM_SET_TRANSFORM = ProjectLinks.URL_PARAM_SET_TRANSFORM;
    public readonly URL_PARAM_ADD_PUSH_SOURCE = ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE;

    public datasetOverviewTabData$: Observable<DatasetOverviewTabData>;
    private ngbModalService = inject(NgbModal);
    private datasetFlowsService = inject(DatasetFlowsService);
    private fileUploadService = inject(FileUploadService);
    private configService = inject(AppConfigService);
    private loggedUserService = inject(LoggedUserService);
    private datasetCollaborationsService = inject(DatasetCollaborationsService);

    public ngOnInit(): void {
        this.role$ = this.datasetCollaborationsService.getRoleByDatasetId(this.datasetOverviewTabData.datasetBasics.id);
        this.uploadFileLoading$ = this.fileUploadService.isUploadFile;
    }
    public showWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

    public get metadataFragmentBlock(): MetadataBlockFragment {
        return this.datasetOverviewTabData.overviewUpdate.overview.metadata.chain.blocks.nodes[0];
    }

    public get canEditDatasetInfo(): boolean {
        if (this.hasDatasetInfo) {
            return this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit;
        } else {
            return false;
        }
    }

    public get enableScheduling(): boolean {
        return this.configService.featureFlags.enableScheduling;
    }

    public get canAddDatasetInfo(): boolean {
        if (!this.hasDatasetInfo) {
            return this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit;
        } else {
            return false;
        }
    }

    public get hasDatasetInfo(): boolean {
        if (this.datasetOverviewTabData.overviewUpdate) {
            const currentInfo: DatasetCurrentInfoFragment =
                this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentInfo;
            return (
                !isNil(currentInfo.description) ||
                (!isNil(currentInfo.keywords) && Boolean(currentInfo.keywords && currentInfo.keywords.length))
            );
        } else {
            return false;
        }
    }

    public get canAddSetPollingSource(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return (
                !this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentPollingSource &&
                this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root &&
                !this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentPushSources.length
            );
        } else {
            return false;
        }
    }
    public get canAddPushSource(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return (
                !this.datasetOverviewTabData.overviewUpdate.overview.metadata.chain.blocks.nodes.filter(
                    (item) => item.event.__typename === "AddPushSource",
                ).length && this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root
            );
        } else {
            return false;
        }
    }

    public get canAddSetTransform(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return (
                !this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentTransform &&
                this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Derivative
            );
        } else {
            return false;
        }
    }

    public get canAddReadme(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return !this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentReadme && !this.editingReadme;
        } else {
            return false;
        }
    }

    public get canEditReadme(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return !isNil(this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentReadme);
        } else {
            return false;
        }
    }

    public get canAddLicense(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return isNil(this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public get canEditLicense(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return !isNil(this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentLicense);
        } else {
            return false;
        }
    }

    public get canAddWatermark(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return !this.hasWatermark && this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public get canEditWatermark(): boolean {
        if (this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit) {
            return this.hasWatermark && this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root;
        } else {
            return false;
        }
    }

    public get canSchedule(): boolean {
        return this.datasetOverviewTabData.datasetPermissions.permissions.flows.canRun;
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
        return !isNil(this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentPollingSource);
    }

    public get showDragAndDropBlock(): boolean {
        return !this.hasSetPollingSource && this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root;
    }

    public get hasCurrentTransform(): boolean {
        return !isNil(this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentTransform);
    }

    private get hasWatermark(): boolean {
        return !isNil(this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentWatermark);
    }

    public get isPrivate(): boolean {
        return this.datasetOverviewTabData.datasetBasics.visibility.__typename === "PrivateDatasetVisibility";
    }

    public get showAddDataButton(): boolean {
        if (this.isUserLogged) {
            return (
                !this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentPollingSource &&
                this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root &&
                this.datasetOverviewTabData.datasetPermissions.permissions.metadata.canCommit
            );
        } else {
            return false;
        }
    }

    public inferTableSchema(schema: DataSchemaField[]): ColumnDescriptor[] {
        return schema.map((f: DataSchemaField) => ({ columnName: f.name }));
    }

    public openInformationModal() {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditDetailsModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditDetailsModalComponent;
        modalRefInstance.currentState = {
            schema: this.datasetOverviewTabData.overviewUpdate.schema,
            data: this.datasetOverviewTabData.overviewUpdate.content,
            overview: this.datasetOverviewTabData.overviewUpdate.overview,
            size: this.datasetOverviewTabData.overviewUpdate.size,
        };
        modalRefInstance.datasetBasics = this.datasetOverviewTabData.datasetBasics;
        from(modalRef.result)
            .pipe(take(1))
            .subscribe(() => {
                this.navigationService.navigateToDatasetView({
                    accountName: this.datasetOverviewTabData.datasetBasics.owner.accountName,
                    datasetName: this.datasetOverviewTabData.datasetBasics.name,
                    tab: DatasetViewTypeEnum.Overview,
                });
            });
    }

    public openLicenseModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditLicenseModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditLicenseModalComponent;
        modalRefInstance.currentState = {
            schema: this.datasetOverviewTabData.overviewUpdate.schema,
            data: this.datasetOverviewTabData.overviewUpdate.content,
            overview: this.datasetOverviewTabData.overviewUpdate.overview,
            size: this.datasetOverviewTabData.overviewUpdate.size,
        };
        modalRefInstance.datasetBasics = this.datasetOverviewTabData.datasetBasics;
        from(modalRef.result)
            .pipe(take(1))
            .subscribe(() => {
                this.navigationService.navigateToDatasetView({
                    accountName: this.datasetOverviewTabData.datasetBasics.owner.accountName,
                    datasetName: this.datasetOverviewTabData.datasetBasics.name,
                    tab: DatasetViewTypeEnum.Overview,
                });
            });
    }

    public openWatermarkModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(EditWatermarkModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditWatermarkModalComponent;
        modalRefInstance.currentWatermark =
            this.datasetOverviewTabData.overviewUpdate.overview.metadata.currentWatermark;
        modalRefInstance.datasetBasics = this.datasetOverviewTabData.datasetBasics;
    }

    public onAddReadme(): void {
        this.editingReadme = true;
    }

    public refreshNow(): void {
        const datasetTrigger$: Observable<boolean> =
            this.datasetOverviewTabData.datasetBasics.kind === DatasetKind.Root
                ? this.datasetFlowsService.datasetTriggerIngestFlow({
                      datasetId: this.datasetOverviewTabData.datasetBasics.id,
                  })
                : this.datasetFlowsService.datasetTriggerTransformFlow({
                      datasetId: this.datasetOverviewTabData.datasetBasics.id,
                  });

        datasetTrigger$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((success: boolean) => {
            if (success) {
                setTimeout(() => {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetOverviewTabData.datasetBasics.owner.accountName,
                        datasetName: this.datasetOverviewTabData.datasetBasics.name,
                        tab: DatasetViewTypeEnum.Flows,
                    });
                }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
            }
        });
    }

    public addData(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(AddDataModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddDataModalComponent;
        modalRefInstance.datasetBasics = this.datasetOverviewTabData.datasetBasics;
    }

    public onFileDropped(files: FileList): void {
        this.droppedFile = files[0];
        const fileSizeMb = this.droppedFile.size * Math.pow(10, -6);
        if (fileSizeMb <= this.configService.ingestUploadFileLimitMb) {
            this.fileUploadService
                .uploadFile(this.droppedFile, this.datasetOverviewTabData.datasetBasics)
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
