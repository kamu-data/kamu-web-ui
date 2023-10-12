import {
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
import { momentConvertDatetoLocalWithFormat } from "src/app/common/app.helpers";
import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "src/app/common/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import { SQL_EDITOR_OPTIONS } from "src/app/dataset-block/metadata-block/components/event-details/config-editor.events";
import _ from "lodash";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    @Output() pageChangeEmit = new EventEmitter<number>();

    public readonly SQL_EDITOR_OPTIONS = {
        ...SQL_EDITOR_OPTIONS,
        readOnly: true,
        automaticLayout: true,
    };

    public readonly ReadSectionMapping: Record<string, string> = {
        ReadStepCsv: "Csv",
        ReadStepJsonLines: "Json lines",
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

    constructor(private datasetSubsService: DatasetSubscriptionsService, private navigationService: NavigationService) {
        super();
    }

    public ngOnInit() {
        this.trackSubscription(
            this.datasetSubsService.onMetadataSchemaChanges.subscribe((schemaUpdate: MetadataSchemaUpdate) => {
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

    public get latestBlockhash(): string {
        return this.currentState ? this.currentState.metadataSummary.metadata.chain.blocks.nodes[0].blockHash : "";
    }

    public get currentLicense(): MaybeNullOrUndefined<LicenseFragment> {
        return this.currentState?.metadataSummary.metadata.currentLicense;
    }

    public get currentWatermark(): MaybeNullOrUndefined<string> {
        return this.currentState?.metadataSummary.metadata.currentWatermark;
    }

    public get currentSource(): MaybeNullOrUndefined<SetPollingSourceEventFragment> {
        return this.currentState?.metadataSummary.metadata.currentSource;
    }

    public get currentTransform(): MaybeNullOrUndefined<DatasetTransformFragment> {
        return this.currentState?.metadataSummary.metadata.currentTransform;
    }

    public get latestBlockSystemTime(): string {
        const systemTimeAsString: MaybeUndefined<string> =
            this.currentState?.metadataSummary.metadata.chain.blocks.nodes[0].systemTime;
        return systemTimeAsString
            ? momentConvertDatetoLocalWithFormat({
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
                !_.isNil(this.currentState.metadataSummary.metadata.currentSource) &&
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

    public navigateToEditSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}
