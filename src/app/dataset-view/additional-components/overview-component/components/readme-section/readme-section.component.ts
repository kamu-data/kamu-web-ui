import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { EditMode } from "./readme-section.types";
import { DatasetCommitService } from "../../services/dataset-commit.service";

@Component({
    selector: "app-readme-section",
    templateUrl: "./readme-section.component.html",
    styleUrls: ["./readme-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadmeSectionComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Input() public currentReadme?: MaybeNull<string>;
    public editMode: typeof EditMode = EditMode;
    public viewMode = EditMode.Edit;
    public readmeState = "";
    @Input() public editViewShow = false;
    @Output() public editViewShowEmmiter = new EventEmitter<boolean>();

    public get readmeChanged(): boolean {
        return this.currentReadme !== this.readmeState;
    }

    constructor(private datasetCommitService: DatasetCommitService) {
        super();
    }

    ngOnInit(): void {
        if (this.currentReadme) {
            this.readmeState = this.currentReadme;
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
        this.editViewShow = !this.editViewShow;
        this.editViewShowEmmiter.emit(this.editViewShow);
    }

    public onCancelChanges(): void {
        this.readmeState = this.currentReadme ?? "";
        this.reset();
    }

    public saveChanges(): void {
        if (this.datasetBasics)
            this.trackSubscription(
                this.datasetCommitService
                    .updateReadme(
                        this.datasetBasics.owner.name,
                        this.datasetBasics.name as string,
                        this.readmeState,
                    )
                    .subscribe(() => {
                        this.reset();
                    }),
            );
    }

    private reset(): void {
        this.viewMode = EditMode.Edit;
        this.editViewShow = false;
        this.editViewShowEmmiter.emit(this.editViewShow);
    }
}
