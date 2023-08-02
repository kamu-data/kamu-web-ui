import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetOverviewFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { OverviewDataUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-readme-section",
    templateUrl: "./readme-section.component.html",
    styleUrls: ["./readme-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadmeSectionComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Input() public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };
    public isEditMode = true;
    public initialReadmeState = "";
    public readmeState = "";
    public isMarkdownEditView = false;

    public get readmeChanged(): boolean {
        return this.initialReadmeState !== this.readmeState;
    }

    constructor(
        private appDatasetSubsService: AppDatasetSubscriptionsService,
        private createDatasetService: AppDatasetCreateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.appDatasetSubsService.onDatasetOverviewDataChanges.subscribe(
                (overviewUpdate: OverviewDataUpdate) => {
                    this.initialReadmeState = this.readmeState =
                        overviewUpdate.overview.metadata.currentReadme ?? "";
                },
            ),
        );
    }

    public toggleReadmeView(): void {
        this.isMarkdownEditView = !this.isMarkdownEditView;
    }

    public toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
    }

    public onCancelChanges(): void {
        this.readmeState = this.initialReadmeState;
        this.isMarkdownEditView = false;
        this.isEditMode = true;
    }

    public commitChanges(): void {
        if (this.datasetBasics)
            this.trackSubscription(
                this.createDatasetService
                    .updateReadme(
                        this.datasetBasics.owner.name,
                        this.datasetBasics.name as string,
                        this.readmeState,
                    )
                    .subscribe(() => (this.isMarkdownEditView = false)),
            );
    }
}
