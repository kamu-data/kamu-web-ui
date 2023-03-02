import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
    DatasetOverviewFragment,
    DatasetDataSizeFragment,
    DatasetBasicsFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

@Component({
    selector: "app-details-modal",
    templateUrl: "./details-modal.component.html",
    styleUrls: ["./details-modal.component.sass"],
})
export class DetailsModalComponent extends BaseComponent implements OnInit {
    @Input() public currentState: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };
    @Input() public datasetBasics: DatasetBasicsFragment;
    public keywordsSet = new Set([] as string[]);
    public description: string;
    constructor(
        private createDatasetService: AppDatasetCreateService,
        private yamlEventService: TemplatesYamlEventsService,
        public activeModal: NgbActiveModal,
    ) {
        super();
    }

    public get keywords(): string[] {
        return Array.from(this.keywordsSet);
    }

    public get isDetailsExist(): boolean {
        return !!this.description || !!this.keywords.length;
    }

    ngOnInit(): void {
        this.currentState.overview.metadata.currentInfo.keywords
            ? this.currentState.overview.metadata.currentInfo.keywords.reduce(
                  (set: Set<string>, keyword: string) => set.add(keyword),
                  this.keywordsSet,
              )
            : this.keywordsSet.clear();

        this.currentState.overview.metadata.currentInfo.description
            ? (this.description =
                  this.currentState.overview.metadata.currentInfo.description)
            : (this.description = "");
    }

    public commitSetInfoEvent(): void {
        this.trackSubscription(
            this.createDatasetService
                .commitEventToDataset(
                    this.datasetBasics.owner.name,
                    this.datasetBasics.name as string,
                    this.yamlEventService.buildYamlSetInfoEvent(
                        this.description,
                        this.keywords,
                    ),
                )
                .subscribe(),
        );
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
