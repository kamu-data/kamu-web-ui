/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, inject, Input, OnInit } from "@angular/core";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
    DatasetOverviewFragment,
    DatasetDataSizeFragment,
    DatasetBasicsFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSchema, DataRow } from "src/app/interface/dataset.interface";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isEqual } from "src/app/common/helpers/app.helpers";
import { MatIconModule } from "@angular/material/icon";
import { NgFor } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-details-modal",
    templateUrl: "./edit-details-modal.component.html",
    standalone: true,
    imports: [
        MatDividerModule,
        FormsModule,
        MatChipsModule,
        NgFor,
        MatIconModule,
    ],
})
export class EditDetailsModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public currentState?: {
        schema: MaybeNull<DatasetSchema>;
        data: DataRow[];
        overview: DatasetOverviewFragment;
        size: DatasetDataSizeFragment;
    };
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public keywordsSet = new Set([] as string[]);
    public description = "";
    public initialDescription = "";
    public initialKeywords: string[] = [];

    private datasetCommitService = inject(DatasetCommitService);
    private yamlEventService = inject(TemplatesYamlEventsService);
    public activeModal = inject(NgbActiveModal);
    private loggedUserService = inject(LoggedUserService);

    public get keywords(): string[] {
        return Array.from(this.keywordsSet);
    }

    public get isDetailsExist(): boolean {
        return !!this.description || !!this.keywords.length;
    }

    public get unmodifiedDetails(): boolean {
        return this.description === this.initialDescription && isEqual(this.keywords, this.initialKeywords);
    }

    public ngOnInit(): void {
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
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                event: this.yamlEventService.buildYamlSetInfoEvent(this.description, this.keywords),
            })
            .pipe(finalize(() => this.activeModal.close()))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
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
