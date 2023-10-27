import { ChangeDetectionStrategy, Component, EventEmitter, OnChanges, Output, SimpleChanges } from "@angular/core";

import * as monaco from "monaco-editor";
import { MonacoService } from "../../services/monaco.service";
import { BaseEditorComponent } from "../base-editor/base-editor.componet";
import { getError } from "../../helpers/editor-error-formatter";

const YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "vs",
    language: "yaml",
    renderLineHighlight: "none",
    minimap: {
        enabled: false,
    },
    scrollBeyondLastLine: false,
};

@Component({
    selector: "app-yaml-editor",
    templateUrl: "./yaml-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEditorComponent extends BaseEditorComponent implements OnChanges {
    public readonly YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = YAML_EDITOR_OPTIONS;

    @Output() public yamlTemplateChange = new EventEmitter<string>();

    constructor(private monacoService: MonacoService) {
        super();
    }

    public ngOnChanges(changes: SimpleChanges) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (changes.error) {
            if (this.error) {
                this.monacoService.setErrorMarker(this.editorModel, getError(this.error));
            }

            if (!this.error) {
                this.monacoService.clearErrorMarker(this.editorModel);
            }
        }
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        this.onEditorLoaded.emit();
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        this.editorModel = editor.getModel() as monaco.editor.ITextModel;
    }

    public modelChange(): void {
        this.yamlTemplateChange.emit(this.template);
    }
}
