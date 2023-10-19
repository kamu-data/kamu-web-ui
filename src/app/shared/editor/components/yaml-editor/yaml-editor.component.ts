import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";

import * as monaco from "monaco-editor";
import { MaybeNull } from "../../../../common/app.types";
import { MonacoService } from "../../services/monaco.service";
import { YAML_EDITOR_OPTIONS } from "./config-editor.events";

@Component({
    selector: "app-yaml-editor",
    templateUrl: "./yaml-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEditorComponent implements OnChanges {
    @Input() public readonly YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
        YAML_EDITOR_OPTIONS;
    @Input() public yamlTemplate = "";
    @Input() public yamlError: MaybeNull<string>;

    @Output() public yamlTemplateChange = new EventEmitter<string>();

    private editorModel: monaco.editor.ITextModel;

    constructor(private monacoService: MonacoService) {}

    public ngOnChanges(changes: SimpleChanges) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (changes.yamlError) {
            if (this.yamlError) {
                this.monacoService.setErrorMarker(this.editorModel, this.yamlError);
            }

            if (!this.yamlError) {
                this.monacoService.clearErrorMarker(this.editorModel);
            }
        }
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        this.editorModel = editor.getModel() as monaco.editor.ITextModel;
    }

    public modelChange(): void {
        this.yamlTemplateChange.emit(this.yamlTemplate);
    }
}
