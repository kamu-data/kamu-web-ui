/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import { MarkdownModule } from "ngx-markdown";

import { BaseComponent } from "@common/components/base.component";
import { addMarkdownRunButton } from "@common/helpers/app.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { EditMode } from "src/app/dataset-view/additional-components/overview-component/components/readme-section/readme-section.types";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-readme-section",
    templateUrl: "./readme-section.component.html",
    styleUrls: ["./readme-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        //-----//
        MatIconModule,
        MarkdownModule,
    ],
})
export class ReadmeSectionComponent extends BaseComponent implements OnChanges, AfterViewChecked {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public currentReadme?: MaybeNull<string>;
    @Input({ required: true }) public editingInProgress = false;
    @Input({ required: true }) public editable = true;
    @Output() public editViewShowEmitter = new EventEmitter<boolean>();

    public editMode: typeof EditMode = EditMode;
    public viewMode = EditMode.Edit;
    public readmeState = "";

    public get readmeChanged(): boolean {
        return this.currentReadme !== this.readmeState;
    }

    private navigationService = inject(NavigationService);
    private datasetCommitService = inject(DatasetCommitService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.currentReadme && changes.currentReadme.currentValue !== changes.currentReadme.previousValue) {
            this.readmeState = changes.currentReadme.currentValue as string;
            this.editingInProgress = false;
        }
    }

    public ngAfterViewChecked(): void {
        this.addDynamicRunButton();
    }

    public get isEditView(): boolean {
        return this.viewMode === EditMode.Edit;
    }

    public get isPreviewView(): boolean {
        return this.viewMode === EditMode.Preview;
    }

    public selectMode(mode: EditMode): void {
        this.viewMode = mode;
    }

    public showEditTabs(): void {
        this.editingInProgress = !this.editingInProgress;
        this.editViewShowEmitter.emit(this.editingInProgress);
    }

    public onCancelChanges(): void {
        this.readmeState = this.currentReadme ?? "";
        this.reset();
    }

    public saveChanges(): void {
        this.datasetCommitService
            .updateReadme({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                content: this.readmeState,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.reset();
            });
    }

    private reset(): void {
        this.viewMode = EditMode.Edit;
        this.editingInProgress = false;
        this.editViewShowEmitter.emit(this.editingInProgress);
    }

    private addDynamicRunButton(): void {
        if (this.readmeState) {
            // Find all sql queries between ```sql and ```
            const sqlQueries = this.readmeState.match(/(?<=```sql\s+).*?(?=\s+```)/gs);
            addMarkdownRunButton(
                sqlQueries,
                `/${this.datasetBasics.owner.accountName}/${this.datasetBasics.name}/${DatasetViewTypeEnum.Data}?${ProjectLinks.URL_QUERY_PARAM_SQL_QUERY}`,
            );
        }
    }
}
