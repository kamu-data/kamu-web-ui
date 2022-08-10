import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { DataHelpersService } from "src/app/services/datahelpers.service";
import {
    Dataset,
    MetadataBlockFragment,
} from "../../../api/kamu.graphql.interface";
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
    ) {}

    ngOnInit(): void {
        this.appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(
            (overview: Object[]) => {
                this.currentOverviewData = overview;
            },
        );
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
