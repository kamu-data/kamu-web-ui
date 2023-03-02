import { OverviewDataUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetKind } from "./../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { DataHelpers } from "src/app/common/data.helpers";
import { NavigationService } from "src/app/services/navigation.service";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../../../api/kamu.graphql.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { DataRow, DatasetSchema } from "src/app/interface/dataset.interface";
import { MaybeNull } from "src/app/common/app.types";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatChipInputEvent } from "@angular/material/chips";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";

@Component({
    selector: "app-overview",
    templateUrl: "overview-component.html",
    styleUrls: ["./overview-component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends BaseComponent implements OnInit {
    @Input() public isMarkdownEditView: boolean;
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() toggleReadmeViewEmit = new EventEmitter<null>();
    @Output() selectTopicEmit = new EventEmitter<string>();
    public keywordsSet = new Set([] as string[]);
    public description = "";
    private readonly initialTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setInfo\n";
    private yamlSetInfoTemplate: string;

    public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };

    public get keywords(): string[] {
        return Array.from(this.keywordsSet);
    }

    public get isDetailsExist(): boolean {
        return !!this.description || !!this.keywords.length;
    }

    constructor(
        private appDatasetSubsService: AppDatasetSubscriptionsService,
        private navigationService: NavigationService,
        private modalService: NgbModal,
        private createDatasetService: AppDatasetCreateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(
                (overviewUpdate: OverviewDataUpdate) => {
                    this.currentState = {
                        schema: overviewUpdate.schema,
                        data: overviewUpdate.content,
                        size: overviewUpdate.size,
                        overview: overviewUpdate.overview,
                    };

                    this.currentState.overview.metadata.currentInfo.keywords
                        ? this.currentState.overview.metadata.currentInfo.keywords.reduce(
                              (set: Set<string>, keyword: string) =>
                                  set.add(keyword),
                              this.keywordsSet,
                          )
                        : this.keywordsSet.clear();

                    this.currentState.overview.metadata.currentInfo.description
                        ? (this.description =
                              this.currentState.overview.metadata.currentInfo.description)
                        : (this.description = "");
                },
            ),
        );
        this.yamlSetInfoTemplate = this.initialTemplate;
    }

    public showWebsite(url: string): void {
        this.navigationService.navigateToWebsite(url);
    }

    public toggleReadmeView(): void {
        this.toggleReadmeViewEmit.emit();
    }

    public selectTopic(topicName: string): void {
        this.selectTopicEmit.emit(topicName);
    }

    public datasetKind(kind: DatasetKind): string {
        return DataHelpers.datasetKind2String(kind);
    }

    get metadataFragmentBlock(): MetadataBlockFragment | undefined {
        return this.currentState
            ? this.currentState.overview.metadata.chain.blocks.nodes[0]
            : undefined;
    }

    public openInformationModal(content: unknown) {
        this.modalService.open(content, { centered: true });
    }

    public commitSetInfoEvent(): void {
        if (this.datasetBasics) {
            this.trackSubscription(
                this.createDatasetService
                    .commitEventToDataset(
                        this.datasetBasics.owner.name,
                        this.datasetBasics.name as string,
                        this.buildYamlSetInfoEvent(),
                    )
                    .subscribe(() => {
                        this.yamlSetInfoTemplate = this.initialTemplate;
                    }),
            );
        }
    }

    private buildYamlSetInfoEvent(): string {
        if (this.description)
            this.yamlSetInfoTemplate += `  description: ${this.description}\n`;
        if (this.keywords.length) {
            this.yamlSetInfoTemplate += `  keywords:\n`;
            this.keywords.forEach(
                (keyword: string) =>
                    (this.yamlSetInfoTemplate += `    - ${keyword}\n`),
            );
        }
        return this.yamlSetInfoTemplate;
    }

    public addKeywordFromInput(event: MatChipInputEvent) {
        if (event.value) {
            this.keywordsSet.add(event.value);
            event.chipInput.clear();
        }
    }

    public removeKeyword(keyword: string) {
        this.keywordsSet.delete(keyword);
    }
}
