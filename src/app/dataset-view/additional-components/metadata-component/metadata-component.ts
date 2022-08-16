import { NavigationService } from "src/app/services/navigation.service";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataViewSchema } from "../../../interface/search.interface";
import AppValues from "../../../common/app.values";
import { AppDatasetSubsService } from "../../datasetSubs.service";
import { MetadataSchemaUpdate } from "../../datasetSubs.interface";
import {
    DatasetBasicsFragment,
    DatasetMetadataDetailsFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { DataHelpersService } from "src/app/services/datahelpers.service";

@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
})
export class MetadataComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() public pageChangeEvent: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onSelectTopicEmit: EventEmitter<string> = new EventEmitter();
    @Output() onClickDatasetEmit: EventEmitter<string> = new EventEmitter();

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
        schema: DataViewSchema;
        metadata: DatasetMetadataDetailsFragment;
        pageInfo: PageBasedInfo;
    };

    constructor(
        private dataHelpers: DataHelpersService,
        private appDatasetSubsService: AppDatasetSubsService,
        private navigationService: NavigationService,
    ) {}

    ngOnInit() {
        this.appDatasetSubsService.onMetadataSchemaChanges.subscribe(
            (schemaUpdate: MetadataSchemaUpdate) => {
                this.currentState = {
                    schema: schemaUpdate.schema,
                    metadata: schemaUpdate.metadata,
                    pageInfo: schemaUpdate.pageInfo,
                };
            },
        );
    }

    public navigateToWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

    public selectTopic(topicName: string): void {
        this.onSelectTopicEmit.emit(topicName);
    }

    public onClickDataset(idDataset: string): void {
        this.onClickDatasetEmit.emit(idDataset);
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.onPageChangeEmit.emit(params);
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
            ? this.dataHelpers.shortHash(
                  this.currentState.metadata.chain.blocks.nodes[0].blockHash,
              )
            : "";
    }

    public get latestBlockSystemTime(): string {
        const systemTimeAsString: string | undefined =
            this.currentState?.metadata.chain.blocks.nodes[0].systemTime;

        return systemTimeAsString
            ? AppValues.momentConverDatetoLocalWithFormat({
                  date: new Date(String(systemTimeAsString)),
                  format: "DD MMM YYYY",
                  isTextDate: true,
              })
            : "";
    }
}
