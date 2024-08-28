import {
    AddPushSourceEventFragment,
    DatasetKind,
    DatasetPermissionsFragment,
    DatasetTransformFragment,
    LicenseFragment,
    SetPollingSourceEventFragment,
} from "../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatasetSchema } from "../../../interface/dataset.interface";
import AppValues from "../../../common/app.values";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    DatasetBasicsFragment,
    DatasetMetadataSummaryFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { momentConvertDateToLocalWithFormat, promiseWithCatch } from "src/app/common/app.helpers";
import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "src/app/common/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import _ from "lodash";
import { ModalService } from "src/app/components/modal/modal.service";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;
    @Output() pageChangeEmit = new EventEmitter<number>();

    public readonly ReadSectionMapping: Record<string, string> = {
        ReadStepCsv: "Csv",
        ReadStepGeoJson: "Geo json",
        ReadStepEsriShapefile: "Esri shapefile",
        ReadStepParquet: "Parquet",
        ReadStepJson: "Json",
        ReadStepNdJson: "Newline-delimited json",
        ReadStepNdGeoJson: "Newline-delimited geo json",
    };

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        metadataSummary: DatasetMetadataSummaryFragment;
        pageInfo: PageBasedInfo;
    };

    constructor(
        private datasetSubsService: DatasetSubscriptionsService,
        private navigationService: NavigationService,
        private modalService: ModalService,
    ) {
        super();
    }

    public ngOnInit() {
        this.trackSubscription(
            this.datasetSubsService.metadataSchemaChanges.subscribe((schemaUpdate: MetadataSchemaUpdate) => {
                this.currentState = {
                    schema: schemaUpdate.schema,
                    metadataSummary: schemaUpdate.metadataSummary,
                    pageInfo: schemaUpdate.pageInfo,
                };
            }),
        );
    }

    public onPageChange(currentPage: number): void {
        this.pageChangeEmit.emit(currentPage);
    }

    public get currentPage(): number {
        return this.currentState ? this.currentState.pageInfo.currentPage + 1 : 1;
    }

    public get totalPages(): number {
        return this.currentState?.pageInfo.totalPages ?? 1;
    }

    public get latestBlockHash(): string {
        return this.currentState ? this.currentState.metadataSummary.metadata.chain.blocks.nodes[0].blockHash : "";
    }

    public get currentLicense(): MaybeNullOrUndefined<LicenseFragment> {
        return this.currentState?.metadataSummary.metadata.currentLicense;
    }

    public get currentWatermark(): MaybeNullOrUndefined<string> {
        return this.currentState?.metadataSummary.metadata.currentWatermark;
    }

    public get currentPollingSource(): MaybeNullOrUndefined<SetPollingSourceEventFragment> {
        return this.currentState?.metadataSummary.metadata.currentPollingSource;
    }

    public get currentPushSources(): MaybeNullOrUndefined<AddPushSourceEventFragment[]> {
        return this.currentState?.metadataSummary.metadata.currentPushSources;
    }

    public get currentTransform(): MaybeNullOrUndefined<DatasetTransformFragment> {
        return this.currentState?.metadataSummary.metadata.currentTransform;
    }

    public get latestBlockSystemTime(): string {
        const systemTimeAsString: MaybeUndefined<string> =
            this.currentState?.metadataSummary.metadata.chain.blocks.nodes[0].systemTime;
        return systemTimeAsString
            ? momentConvertDateToLocalWithFormat({
                  date: new Date(String(systemTimeAsString)),
                  format: AppValues.DISPLAY_DATE_FORMAT,
                  isTextDate: true,
              })
            : "";
    }

    public get canEditSetPollingSource(): boolean {
        if (this.currentState) {
            return (
                this.datasetBasics.kind === DatasetKind.Root &&
                !_.isNil(this.currentState.metadataSummary.metadata.currentPollingSource) &&
                this.datasetPermissions.permissions.canCommit
            );
        } else {
            return false;
        }
    }

    public get canEditAddPushSource(): boolean {
        if (this.currentState) {
            return (
                this.datasetBasics.kind === DatasetKind.Root &&
                this.currentState.metadataSummary.metadata.currentPushSources.length > 0 &&
                this.datasetPermissions.permissions.canCommit
            );
        } else {
            return false;
        }
    }

    public get canEditSetTransform(): boolean {
        if (this.currentState) {
            return (
                this.datasetBasics.kind === DatasetKind.Derivative &&
                !_.isNil(this.currentState.metadataSummary.metadata.currentTransform) &&
                this.datasetPermissions.permissions.canCommit
            );
        } else {
            return false;
        }
    }

    public navigateToEditPollingSource(): void {
        this.navigationService.navigateToAddPollingSource({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public navigateToEditAddPushSource(sourceName: string): void {
        this.navigationService.navigateToAddPushSource(
            {
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
            },
            sourceName,
        );
    }

    public navigateToAddPushSource(): void {
        this.navigationService.navigateToAddPushSource({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public navigateToEditSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public onDeletePollingSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
        // this.trackSubscription(
        //     this.datasetCommitService
        //         .commitEventToDataset(
        //             this.getDatasetInfoFromUrl().accountName,
        //             this.getDatasetInfoFromUrl().datasetName,
        //             this.yamlEventService.buildYamlDisablePollingSourceEvent(),
        //         )
        //         .subscribe(),
        // );
    }

    public onDeletePushSource(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public hasAnySource(): boolean {
        return !this.currentPollingSource && !this.currentPushSources?.length;
    }
}
