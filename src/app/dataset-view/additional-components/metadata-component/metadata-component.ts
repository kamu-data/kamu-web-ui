import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataViewSchema } from "../../../interface/search.interface";
import AppValues from "../../../common/app.values";
import { AppDatasetSubsService } from "../../datasetSubs.service";
import { MetadataSchemaUpdate } from "../../datasetSubs.interface";
import { Dataset, PageBasedInfo } from "src/app/api/kamu.graphql.interface";

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
    selector: "app-metadata",
    templateUrl: "./metadata.component.html",
})
export class MetadataComponent implements OnInit {
    @Input() public datasetInfo: Dataset;
    @Output() public pageChangeEvent: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onPageChangeEmit: EventEmitter<{
        currentPage: number;
        isClick: boolean;
    }> = new EventEmitter();
    @Output() onSelectTopicEmit: EventEmitter<string> = new EventEmitter();
    @Output() onClickDatasetEmit: EventEmitter<string> = new EventEmitter();

    public page = 1;
    private previousPage: number;
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

    public currentSchema?: DataViewSchema;
    public pageInfo: PageBasedInfo;
    public currentPage: number = 0;

    constructor(private appDatasetSubsService: AppDatasetSubsService) {}

    ngOnInit() {
        this.appDatasetSubsService.onMetadataSchemaChanges.subscribe(
            (schemaUpdate: MetadataSchemaUpdate) => {
                this.currentSchema = schemaUpdate.schema;
                this.pageInfo = schemaUpdate.pageInfo;
                this.currentPage = this.pageInfo.currentPage + 1;
            },
        );
    }

    public selectPage(page: string) {
        this.page = parseInt(page, 10) || 1;
    }
    public selectTopic(topicName: string): void {
        this.onSelectTopicEmit.emit(topicName);
    }
    public onClickDataset(idDataset: string): void {
        this.onClickDatasetEmit.emit(idDataset);
    }
    public shortHash(hash: string): string {
        return hash.slice(-8);
    }
    public momentConverDatetoLocalWithFormat(date: string): string {
        return AppValues.momentConverDatetoLocalWithFormat({
            date: new Date(String(date)),
            format: "DD MMM YYYY",
            isTextDate: true,
        });
    }

    formatInput(input: HTMLInputElement) {
        input.value = input.value.replace(FILTER_PAG_REGEX, "");
    }
    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.onPageChangeEmit.emit(params);
    }

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
}
