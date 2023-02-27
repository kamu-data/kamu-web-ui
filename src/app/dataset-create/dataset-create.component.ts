import { BaseComponent } from "src/app/common/base.component";
/* eslint-disable @typescript-eslint/unbound-method */
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "./../common/app.types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import * as monaco from "monaco-editor";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppDatasetCreateService } from "./dataset-create.service";

@Component({
    selector: "app-dataset-create",
    templateUrl: "./dataset-create.component.html",
    styleUrls: ["./dataset-create.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetCreateComponent extends BaseComponent implements OnInit {
    private readonly kindMapper: Record<string, DatasetKind> = {
        root: DatasetKind.Root,
        derivative: DatasetKind.Derivative,
    };
    public readonly initialHint = "# You can edit this file\n";
    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };
    public yamlTemplate = "";
    public fileName: MaybeNull<string> = "";
    public showMonacoEditor = false;
    public errorMessage = "";
    public owners = ["kamu"];
    public createDatasetForm: FormGroup = this.fb.group({
        owner: ["kamu", [Validators.required]],
        datasetName: [
            "",
            [
                Validators.required,
                Validators.pattern(
                    /^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/,
                ),
            ],
        ],
        kind: ["root", [Validators.required]],
    });

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private datasetCreateService: AppDatasetCreateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.datasetCreateService.onErrorMessageChanges.subscribe(
                (message: string) => {
                    this.errorMessage = message;
                    this.cdr.detectChanges();
                },
            ),
        );
    }

    public get datasetName() {
        return this.createDatasetForm.get("datasetName");
    }

    public get isFormValid(): boolean {
        if (this.yamlTemplate) return true;
        return this.createDatasetForm.valid;
    }

    public onCreateDataset(): void {
        this.showMonacoEditor
            ? this.createDatasetFromSnapshot()
            : this.createDatasetFromForm();
    }

    public onFileSelected(event: Event): void {
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
        this.yamlTemplate = "";
    }

    public onShowMonacoEditor(): void {
        this.setAvailabilityControls();
    }

    private createDatasetFromForm(): void {
        const accountId = this.createDatasetForm.controls.owner.value as string;
        const kind =
            this.kindMapper[
                this.createDatasetForm.controls.kind.value as string
            ];
        const datasetName = this.createDatasetForm.controls.datasetName
            .value as string;
        this.trackSubscription(
            this.datasetCreateService
                .createEmptyDataset(accountId, kind, datasetName)
                .subscribe(),
        );
    }

    private createDatasetFromSnapshot(): void {
        if (this.yamlTemplate) {
            this.trackSubscription(
                this.datasetCreateService
                    .createDatasetFromSnapshot("kamu", this.yamlTemplate)
                    .subscribe(),
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
            this.errorMessage = "";
            this.cdr.detectChanges();
        }
    }
}
