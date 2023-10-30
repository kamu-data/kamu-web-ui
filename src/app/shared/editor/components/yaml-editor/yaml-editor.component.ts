import { ChangeDetectionStrategy, Component } from "@angular/core";

import * as monaco from "monaco-editor";
import { BaseEditorComponent } from "../base-editor/base-editor.componet";

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
export class YamlEditorComponent extends BaseEditorComponent {
    public readonly YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = YAML_EDITOR_OPTIONS;

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        this.onEditorLoaded.emit();
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        this.editorModel = editor.getModel() as monaco.editor.ITextModel;
    }
}
