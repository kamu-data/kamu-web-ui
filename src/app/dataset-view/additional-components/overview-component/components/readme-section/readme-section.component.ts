import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { EditMode } from "./readme-section.types";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-readme-section",
    templateUrl: "./readme-section.component.html",
    styleUrls: ["./readme-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadmeSectionComponent extends BaseComponent implements OnChanges {
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

    private datasetCommitService = inject(DatasetCommitService);
    private loggedUserService = inject(LoggedUserService);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.currentReadme && changes.currentReadme.currentValue !== changes.currentReadme.previousValue) {
            this.readmeState = changes.currentReadme.currentValue as string;
        }
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
}
