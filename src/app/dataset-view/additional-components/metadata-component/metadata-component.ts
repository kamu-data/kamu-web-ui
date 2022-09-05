import { shortHash } from "src/app/common/data.helpers";
import { NavigationService } from "src/app/services/navigation.service";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatasetSchema } from "../../../interface/dataset.interface";
import AppValues from "../../../common/app.values";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    DatasetBasicsFragment,
    DatasetMetadataDetailsFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
})
export class MetadataComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() public pageChangeEvent = new EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }>();
    @Output() pageChangeEmit = new EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }>();
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
        metadata: DatasetMetadataDetailsFragment;
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

    public navigateToWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

    public selectTopic(topicName: string): void {
        this.selectTopicEmit.emit(topicName);
    }

    public onClickDataset(dataset: DatasetBasicsFragment): void {
        this.clickDatasetEmit.emit(dataset);
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.pageChangeEmit.emit(params);
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
            ? shortHash(
                  this.currentState.metadata.chain.blocks.nodes[0]
                      .blockHash as string,
              )
            : "";
    }

    public get latestBlockSystemTime(): string {
        const systemTimeAsString: string | undefined = this.currentState
            ?.metadata.chain.blocks.nodes[0].systemTime as string;

        return systemTimeAsString
            ? AppValues.momentConverDatetoLocalWithFormat({
                  date: new Date(String(systemTimeAsString)),
                  format: AppValues.displayDateFormat,
                  isTextDate: true,
              })
            : "";
    }
}
