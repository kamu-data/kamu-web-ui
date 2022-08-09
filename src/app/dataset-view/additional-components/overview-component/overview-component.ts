import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import { DataHelpersService } from "src/app/services/datahelpers.service";
import {DatasetViewContentInterface} from "../../dataset-view.interface";
import {Dataset, MetadataBlockFragment} from "../../../api/kamu.graphql.interface";

@Component({
    selector: "app-overview",
    templateUrl: "overview-component.html",
    encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent {
    @Input() public isMarkdownEditView: boolean;
    @Input() public markdownText: any;
    @Input() public datasetInfo: Dataset;
    @Input() public resultUnitText: string;
    @Input() public tableData: DatasetViewContentInterface;
    @Output() onToggleReadmeViewEmit: EventEmitter<null> = new EventEmitter();
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onSelectTopicEmit: EventEmitter<string> = new EventEmitter();

    constructor(public dataHelpers: DataHelpersService) {}

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }
    public toggleReadmeView(): void {
        this.onToggleReadmeViewEmit.emit();
    }
    public selectTopic(topicName: string): void {
        this.onSelectTopicEmit.emit(topicName);
    }

    get metadataFragmentBlock(): MetadataBlockFragment {
        return this.datasetInfo.metadata.chain.blocks.nodes[0] as MetadataBlockFragment;
    }
}
