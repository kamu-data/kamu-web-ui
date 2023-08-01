import { EditLicenseModalComponent } from "./components/edit-license-modal/edit-license-modal.component";
import { OverviewDataUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetKind } from "./../../../api/kamu.graphql.interface";
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
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { DataRow, DatasetSchema } from "src/app/interface/dataset.interface";
import { MaybeNull } from "src/app/common/app.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EditDetailsModalComponent } from "./components/edit-details-modal/edit-details-modal.component";
import { EditWatermarkModalComponent } from "./components/edit-watermark-modal/edit-watermark-modal.component";

@Component({
    selector: "app-overview",
    templateUrl: "overview-component.html",
    styleUrls: ["./overview-component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() toggleReadmeViewEmit = new EventEmitter<null>();
    @Output() selectTopicEmit = new EventEmitter<string>();

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };

    constructor(
        private appDatasetSubsService: AppDatasetSubscriptionsService,
        private navigationService: NavigationService,
        private modalService: NgbModal,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(
                (overviewUpdate: OverviewDataUpdate) => {
                    this.currentState = {
                        schema: overviewUpdate.schema,
                        data: overviewUpdate.content,
                        size: overviewUpdate.size,
                        overview: overviewUpdate.overview,
                    };
                },
            ),
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

    get metadataFragmentBlock(): MetadataBlockFragment | undefined {
        return this.currentState
            ? this.currentState.overview.metadata.chain.blocks.nodes[0]
            : undefined;
    }

    public openInformationModal() {
        const modalRef: NgbModalRef = this.modalService.open(
            EditDetailsModalComponent,
        );
        const modalRefInstance =
            modalRef.componentInstance as EditDetailsModalComponent;
        modalRefInstance.currentState = this.currentState;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public openLicenseModal(): void {
        const modalRef: NgbModalRef = this.modalService.open(
            EditLicenseModalComponent,
        );
        const modalRefInstance =
            modalRef.componentInstance as EditLicenseModalComponent;
        modalRefInstance.currentState = this.currentState;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public openWatermarkModal(): void {
        const modalRef: NgbModalRef = this.modalService.open(
            EditWatermarkModalComponent,
        );
        const modalRefInstance =
            modalRef.componentInstance as EditWatermarkModalComponent;
        modalRefInstance.currentWatermark = this.currentState?.overview.metadata
            .currentWatermark as string;
        modalRefInstance.datasetBasics = this.datasetBasics;
    }

    public navigateToAddPollingSource(): void {
        if (this.datasetBasics)
            this.navigationService.navigateToAddPollingSource({
                accountName: this.datasetBasics.owner.name,
                datasetName: this.datasetBasics.name as string,
            });
    }

    public navigateToSetTransform(): void {
        if (this.datasetBasics)
            this.navigationService.navigateToSetTransform({
                accountName: this.datasetBasics.owner.name,
                datasetName: this.datasetBasics.name as string,
            });
    }
}
