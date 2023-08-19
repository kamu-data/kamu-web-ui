import { EditLicenseModalComponent } from "./components/edit-license-modal/edit-license-modal.component";
import { OverviewDataUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    DatasetCurrentInfoFragment,
    DatasetKind,
    DatasetPermissionsFragment,
} from "../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { DataHelpers } from "src/app/common/data.helpers";
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

@Component({
    selector: "app-overview",
    templateUrl: "overview.component.html",
    styleUrls: ["./overview.component.scss"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    @Output() toggleReadmeViewEmit = new EventEmitter<null>();
    @Output() selectTopicEmit = new EventEmitter<string>();
    public editingReadme = false;

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };

    constructor(
        private datasetSubsService: DatasetSubscriptionsService,
        private navigationService: NavigationService,
        private modalService: NgbModal,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.trackSubscription(
            this.datasetSubsService.onDatasetOverviewDataChanges.subscribe((overviewUpdate: OverviewDataUpdate) => {
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

    public datasetKind(kind: DatasetKind): string {
        return DataHelpers.capitalizeFirstLetter(kind);
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
            return !this.currentState.overview.metadata.currentSource && this.datasetBasics.kind === DatasetKind.Root;
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

    private get hasWatermark(): boolean {
        return !_.isNil(this.currentState?.overview.metadata.currentWatermark);
    }

    public openInformationModal() {
        const modalRef: NgbModalRef = this.modalService.open(EditDetailsModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditDetailsModalComponent;
        modalRefInstance.currentState = this.currentState;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public openLicenseModal(): void {
        const modalRef: NgbModalRef = this.modalService.open(EditLicenseModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditLicenseModalComponent;
        modalRefInstance.currentState = this.currentState;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public openWatermarkModal(): void {
        const modalRef: NgbModalRef = this.modalService.open(EditWatermarkModalComponent);
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

    public navigateToSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public onAddReadme(): void {
        this.editingReadme = true;
    }
}
