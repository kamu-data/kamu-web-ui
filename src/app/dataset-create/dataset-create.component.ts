import { BaseComponent } from "src/app/common/base.component";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatasetCreateService } from "./dataset-create.service";
import { Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-dataset-create",
    templateUrl: "./dataset-create.component.html",
    styleUrls: ["./dataset-create.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetCreateComponent extends BaseComponent {
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private datasetCreateService = inject(DatasetCreateService);

    private readonly kindMapper: Record<string, DatasetKind> = {
        root: DatasetKind.Root,
        derivative: DatasetKind.Derivative,
    };
    private static readonly INITIAL_YAML_HINT = "# You can edit this file\n";
    public yamlTemplate = "";
    public showMonacoEditor = false;
    public errorMessage$: Observable<string>;
    public owners: string[] = [];
    public createDatasetForm: FormGroup = this.fb.group({
        owner: ["", [Validators.required]],
        datasetName: [
            "",
            [Validators.required, Validators.pattern(/^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/)],
        ],
        kind: ["root", [Validators.required]],
    });

    public ngOnInit(): void {
        const currentUser = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (currentUser) {
            this.owners = [currentUser.accountName];
            this.createDatasetForm.controls.owner.setValue(currentUser.accountName);
        }
        this.errorMessage$ = this.datasetCreateService.errorMessageChanges;
    }

    public get datasetName() {
        return this.createDatasetForm.get("datasetName");
    }

    public get isFormValid(): boolean {
        if (this.yamlTemplate) return true;
        return this.createDatasetForm.valid;
    }

    public onCreateDataset(): void {
        this.showMonacoEditor ? this.createDatasetFromSnapshot() : this.createDatasetFromForm();
    }

    public onFileSelected(event: Event): Promise<MaybeNull<string>> {
        return new Promise<string>((resolve) => {
            const input = event.target as HTMLInputElement;
            if (!input.files?.length) {
                resolve("");
            } else {
                const file = input.files[0];
                const fileReader: FileReader = new FileReader();
                fileReader.onload = () => {
                    this.yamlTemplate += DatasetCreateComponent.INITIAL_YAML_HINT;
                    this.yamlTemplate += fileReader.result as string;
                    resolve(this.yamlTemplate);
                    this.cdr.detectChanges();
                };
                fileReader.readAsText(file);
                this.yamlTemplate = "";
            }
        });
    }

    public onShowMonacoEditor(): void {
        this.setAvailabilityControls();
    }

    private createDatasetFromForm(): void {
        const kind = this.kindMapper[this.createDatasetForm.controls.kind.value as string];
        const datasetName = this.createDatasetForm.controls.datasetName.value as string;
        this.datasetCreateService
            .createEmptyDataset(kind, datasetName)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private createDatasetFromSnapshot(): void {
        if (this.yamlTemplate) {
            this.datasetCreateService
                .createDatasetFromSnapshot(this.yamlTemplate)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
    }

    private setAvailabilityControls(): void {
        this.createDatasetForm.controls.datasetName.setValue("");
        if (this.showMonacoEditor) {
            this.createDatasetForm.controls.datasetName.disable();
            this.createDatasetForm.controls.owner.disable();
            this.createDatasetForm.controls.kind.disable();
        } else {
            this.createDatasetForm.controls.datasetName.enable();
            this.createDatasetForm.controls.owner.enable();
            this.createDatasetForm.controls.kind.enable();
            this.yamlTemplate = "";
            this.datasetCreateService.emitErrorMessageChanged("");
        }
    }
}
