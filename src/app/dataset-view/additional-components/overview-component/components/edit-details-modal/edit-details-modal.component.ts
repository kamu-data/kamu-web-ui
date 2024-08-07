import { Component, Input, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { isEqual } from "lodash";
import {
    DatasetOverviewFragment,
    DatasetDataSizeFragment,
    DatasetBasicsFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { finalize } from "rxjs";

@Component({
    selector: "app-details-modal",
    templateUrl: "./edit-details-modal.component.html",
})
export class EditDetailsModalComponent extends BaseComponent implements OnInit {
    @Input() public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };
    @Input() public datasetBasics: DatasetBasicsFragment;
    public keywordsSet = new Set([] as string[]);
    public description = "";
    public initialDescription = "";
    public initialKeywords: string[] = [];
    constructor(
        private datasetCommitService: DatasetCommitService,
        private yamlEventService: TemplatesYamlEventsService,
        public activeModal: NgbActiveModal,
        private loggedUserService: LoggedUserService,
    ) {
        super();
    }

    public get keywords(): string[] {
        return Array.from(this.keywordsSet);
    }

    public get isDetailsExist(): boolean {
        return !!this.description || !!this.keywords.length;
    }

    public get unmodifiedDetails(): boolean {
        return this.description === this.initialDescription && isEqual(this.keywords, this.initialKeywords);
    }

    ngOnInit(): void {
        if (this.currentState?.overview.metadata.currentInfo.keywords) {
            this.initialKeywords = this.currentState.overview.metadata.currentInfo.keywords;
            this.currentState.overview.metadata.currentInfo.keywords.reduce(
                (set: Set<string>, keyword: string) => set.add(keyword),
                this.keywordsSet,
            );
        } else {
            this.keywordsSet.clear();
        }

        this.currentState?.overview.metadata.currentInfo.description
            ? (this.description = this.initialDescription = this.currentState.overview.metadata.currentInfo.description)
            : (this.description = "");
    }

    public commitSetInfoEvent(): void {
        this.trackSubscription(
            this.datasetCommitService
                .commitEventToDataset({
                    accountId: this.loggedUserService.currentlyLoggedInUser.id,
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                    event: this.yamlEventService.buildYamlSetInfoEvent(this.description, this.keywords),
                })
                .pipe(finalize(() => this.activeModal.close()))
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
