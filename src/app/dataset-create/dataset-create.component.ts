import { MaybeNull } from "./../common/app.types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from "@angular/core";
import * as monaco from "monaco-editor";

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

    public sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

    constructor(private cdr: ChangeDetectorRef) {}

    public onCreateDataset(): void {
        console.log("create");
    }

    public init(editor: monaco.editor.IStandaloneCodeEditor): void {
        console.log("value", editor.getModel()?.getValue());
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
}
