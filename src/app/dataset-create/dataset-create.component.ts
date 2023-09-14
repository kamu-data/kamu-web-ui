import { BaseComponent } from "src/app/common/base.component";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import * as monaco from "monaco-editor";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppDatasetCreateService } from "./dataset-create.service";
import { Observable } from "rxjs";

@Component({
    selector: "app-dataset-create",
    templateUrl: "./dataset-create.component.html",
    styleUrls: ["./dataset-create.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetCreateComponent extends BaseComponent {
    private readonly kindMapper: Record<string, DatasetKind> = {
        root: DatasetKind.Root,
        derivative: DatasetKind.Derivative,
    };
    public readonly initialHint = "# You can edit this file\n";
    public readonly yamlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        theme: "vs",
        language: "yaml",
        renderLineHighlight: "none",
        minimap: {
            enabled: false,
        },
    };
    public yamlTemplate = "";
    public showMonacoEditor = false;
    public errorMessage$: Observable<string>;
    public owners = ["kamu"];
    public createDatasetForm: FormGroup = this.fb.group({
        owner: ["kamu", [Validators.required]],
        datasetName: [
            "",
            [Validators.required, Validators.pattern(/^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/)],
        ],
        kind: ["root", [Validators.required]],
    });

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private datasetCreateService: AppDatasetCreateService,
    ) {
        super();
        this.errorMessage$ = this.datasetCreateService.onErrorMessageChanges;
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
                    this.yamlTemplate += this.initialHint;
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
        const accountId = this.createDatasetForm.controls.owner.value as string;
        const kind = this.kindMapper[this.createDatasetForm.controls.kind.value as string];
        const datasetName = this.createDatasetForm.controls.datasetName.value as string;
        this.trackSubscription(this.datasetCreateService.createEmptyDataset(accountId, kind, datasetName).subscribe());
    }

    private createDatasetFromSnapshot(): void {
        if (this.yamlTemplate) {
            this.trackSubscription(
                this.datasetCreateService.createDatasetFromSnapshot("kamu", this.yamlTemplate).subscribe(),
            );
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
            this.datasetCreateService.errorMessageChanges("");
        }
    }
}
