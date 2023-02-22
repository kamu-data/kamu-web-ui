/* eslint-disable @typescript-eslint/unbound-method */
import { MaybeNull } from "./../common/app.types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from "@angular/core";
import * as monaco from "monaco-editor";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-dataset-create",
    templateUrl: "./dataset-create.component.html",
    styleUrls: ["./dataset-create.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetCreateComponent {
    public yamlTemplate: MaybeNull<string> = "";
    public fileName: MaybeNull<string> = "";
    public showMonacoEditor = false;
    public initialHint = "# You can edit this file\n";
    public owners = ["kamu"];

    public sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

    public createDatasetForm: FormGroup = this.fb.group({
        owner: ["kamu", [Validators.required]],
        datasetName: ["", [Validators.required]],
        kind: ["root", [Validators.required]],
    });

    constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {}

    public onCreateDataset(): void {
        console.log("create", this.createDatasetForm.value);
    }

    public init(editor: monaco.editor.IStandaloneCodeEditor): void {
        // console.log("value", editor.getModel()?.getValue());
    }

    public onFileSelected(event: Event): void {
        this.yamlTemplate = "";
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            return;
        }
        const file = input.files[0];
        this.fileName = file.name;
        const fileReader: FileReader = new FileReader();
        fileReader.onload = () => {
            this.yamlTemplate += this.initialHint;
            this.yamlTemplate += fileReader.result as string;
            this.cdr.detectChanges();
        };
        fileReader.readAsText(file);
    }

    public get isFormValid(): boolean {
        if (this.yamlTemplate) return true;
        return this.createDatasetForm.valid;
    }

    public onShowMonacoEditor(): void {
        this.setAvailabilityControls();
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
        }
    }
}
