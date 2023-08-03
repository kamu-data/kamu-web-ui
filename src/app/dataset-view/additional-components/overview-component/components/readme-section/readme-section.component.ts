import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
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
    public editViewShow = false;

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

    public toggleReadmeView(): void {
        this.editViewShow = !this.editViewShow;
    }

    public onCancelChanges(): void {
        if (this.currentReadme) {
            this.readmeState = this.currentReadme;
            this.editViewShow = false;
            this.viewMode = EditMode.Edit;
        }
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
                    .subscribe(() => (this.editViewShow = false)),
            );
    }
}
