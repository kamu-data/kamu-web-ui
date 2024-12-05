import { NavigationService } from "./../../../../../services/navigation.service";
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
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { EditMode } from "./readme-section.types";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-readme-section",
    templateUrl: "./readme-section.component.html",
    styleUrls: ["./readme-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.currentReadme && changes.currentReadme.currentValue !== changes.currentReadme.previousValue) {
            this.readmeState = changes.currentReadme.currentValue as string;
            this.editingInProgress = false;
        }
    }

    ngAfterViewChecked(): void {
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
            const containerRunButtonElement: HTMLCollectionOf<Element> =
                document.getElementsByClassName("container-run-button");

            if (sqlQueries?.length && !containerRunButtonElement.length) {
                const preElements: NodeListOf<Element> = document.querySelectorAll("pre.language-sql");
                preElements.forEach((preElement: Element, index: number) => {
                    const divElement: HTMLDivElement = document.createElement("div");
                    divElement.classList.add("container-run-button");
                    divElement.style.position = "absolute";
                    divElement.style.top = "10px";
                    divElement.style.right = "65px";
                    const linkElement = document.createElement("a");
                    linkElement.classList.add("markdown-run-button");
                    linkElement.style.padding = "3.6px 16px";
                    linkElement.style.color = "#ffff";
                    linkElement.style.fontSize = "13px";
                    linkElement.style.textDecoration = "none";
                    linkElement.style.backgroundColor = "rgba(255,255, 255, 0.07)";
                    linkElement.style.borderRadius = "4px";
                    linkElement.style.transition = "all 250ms ease-out";
                    linkElement.setAttribute("target", "_blank");
                    linkElement.setAttribute(
                        "href",
                        `/${this.datasetBasics.owner.accountName}/${this.datasetBasics.name}?tab=${DatasetViewTypeEnum.Data}&sqlQuery=${encodeURI(sqlQueries[index])}`,
                    );
                    linkElement.addEventListener("mouseover", () => {
                        linkElement.style.backgroundColor = "rgba(255,255, 255, 0.14)";
                    });
                    linkElement.addEventListener("mouseleave", () => {
                        linkElement.style.backgroundColor = "rgba(255,255, 255, 0.07)";
                    });
                    linkElement.innerHTML = "Run";
                    divElement.appendChild(linkElement);
                    preElement.after(divElement);
                });
            }
        }
    }
}
