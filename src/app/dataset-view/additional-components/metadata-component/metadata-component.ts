import { DataHelpers } from "./../../../common/data.helpers";
import { DatasetKind } from "./../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { DatasetSchema } from "../../../interface/dataset.interface";
import AppValues from "../../../common/app.values";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    DatasetBasicsFragment,
    DatasetMetadataSummaryFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { momentConvertDatetoLocalWithFormat } from "src/app/common/app.helpers";
import { MaybeNull } from "src/app/common/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import { sqlEditorOptions } from "src/app/dataset-block/metadata-block/components/event-details/config-editor.events";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() pageChangeEmit = new EventEmitter<number>();
    @Output() selectTopicEmit = new EventEmitter<string>();
    @Output() clickDatasetEmit = new EventEmitter<DatasetBasicsFragment>();

    public sqlEditorOptions = {
        ...sqlEditorOptions,
        readOnly: true,
        automaticLayout: true,
    };

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        metadata: DatasetMetadataSummaryFragment;
        pageInfo: PageBasedInfo;
    };

    constructor(
        private appDatasetSubsService: AppDatasetSubscriptionsService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    ngOnInit() {
        this.trackSubscription(
            this.appDatasetSubsService.onMetadataSchemaChanges.subscribe(
                (schemaUpdate: MetadataSchemaUpdate) => {
                    this.currentState = {
                        schema: schemaUpdate.schema,
                        metadata: schemaUpdate.metadata,
                        pageInfo: schemaUpdate.pageInfo,
                    };
                },
            ),
        );
    }

    public selectTopic(topicName: string): void {
        this.selectTopicEmit.emit(topicName);
    }

    public onClickDataset(dataset: DatasetBasicsFragment): void {
        this.clickDatasetEmit.emit(dataset);
    }

    public onPageChange(currentPage: number): void {
        this.pageChangeEmit.emit(currentPage);
    }

    public get currentPage(): number {
        return this.currentState
            ? this.currentState.pageInfo.currentPage + 1
            : 1;
    }

    public get totalPages(): number {
        const totalPages = this.currentState?.pageInfo.totalPages;
        return totalPages ?? 1;
    }

    public get latestBlockhash(): string {
        return this.currentState
            ? (this.currentState.metadata.metadata.chain.blocks.nodes[0]
                  .blockHash as string)
            : "";
    }

    public get latestBlockSystemTime(): string {
        const systemTimeAsString: string | undefined = this.currentState
            ?.metadata.metadata.chain.blocks.nodes[0].systemTime as string;
        return systemTimeAsString
            ? momentConvertDatetoLocalWithFormat({
                  date: new Date(String(systemTimeAsString)),
                  format: AppValues.DISPLAY_DATE_FORMAT,
                  isTextDate: true,
              })
            : "";
    }

    public kindToCamelCase(kind: DatasetKind): string {
        return DataHelpers.capitalizeFirstLetter(kind);
    }

    public readSectionMapperType: Record<string, string> = {
        ReadStepCsv: "Csv",
        ReadStepJsonLines: "Json lines",
        ReadStepGeoJson: "Geo json",
        ReadStepEsriShapefile: "Esri shapefile",
        ReadStepParquet: "Parquet",
    };

    public navigateToEditPollingSource(): void {
        if (this.datasetBasics)
            this.navigationService.navigateToAddPollingSource({
                accountName: this.datasetBasics.owner.name,
                datasetName: this.datasetBasics.name as string,
            });
    }

    public navigateToEditSetTransform(): void {
        if (this.datasetBasics)
            this.navigationService.navigateToSetTransform({
                accountName: this.datasetBasics.owner.name,
                datasetName: this.datasetBasics.name as string,
            });
    }
}
