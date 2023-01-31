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
        theme: "vs",
        language: "sql",
        readOnly: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false,
        },
    };

    public currentState?: {
        schema: DatasetSchema;
        metadata: DatasetMetadataSummaryFragment;
        pageInfo: PageBasedInfo;
    };

    constructor(private appDatasetSubsService: AppDatasetSubscriptionsService) {
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
        return DataHelpers.datasetKind2String(kind);
    }
}
