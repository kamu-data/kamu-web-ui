import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { DataHelpersService } from "src/app/services/datahelpers.service";
import { NavigationService } from "src/app/services/navigation.service";
import {
    Dataset,
    MetadataBlockFragment,
} from "../../../api/kamu.graphql.interface";
import { OverviewDataUpdate } from "../../datasetSubs.interface";
import { AppDatasetSubsService } from "../../datasetSubs.service";

@Component({
    selector: "app-overview",
    templateUrl: "overview-component.html",
    encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit {
    @Input() public isMarkdownEditView: boolean;
    @Input() public markdownText: any;
    @Input() public datasetInfo: Dataset;
    @Input() public resultUnitText: string;
    @Output() onToggleReadmeViewEmit: EventEmitter<null> = new EventEmitter();
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    @Output() onSelectTopicEmit: EventEmitter<string> = new EventEmitter();

    public currentOverviewData: Object[] = [];

    constructor(
        public dataHelpers: DataHelpersService,
        private appDatasetSubsService: AppDatasetSubsService,
        private navigationService: NavigationService,
    ) {}

    ngOnInit(): void {
        this.appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(
            (overviewUpdate: OverviewDataUpdate) => {
                this.currentOverviewData = overviewUpdate.content;
            },
        );
    }

    public showWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

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
        return this.datasetInfo.metadata.chain.blocks
            .nodes[0] as MetadataBlockFragment;
    }
}
