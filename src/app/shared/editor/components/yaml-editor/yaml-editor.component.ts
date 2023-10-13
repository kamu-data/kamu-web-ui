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
import { getMonacoNamespace, MonacoService } from "../../services/monaco.service";
import { YAML_EDITOR_OPTIONS } from "./config-editor.events";

@Component({
    selector: "app-yaml-editor",
    templateUrl: "./yaml-editor.component.html",
    styleUrls: ["./yaml-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEditorComponent implements OnChanges {
    @Input() public yamlTemplate = "";
    @Input() public yamlError: MaybeNull<string>;
    @Input() public readonly YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
        YAML_EDITOR_OPTIONS;

    @Output() public onCodeChange = new EventEmitter<string>();
    @Output() public onRunSql = new EventEmitter<null>();

    private editorModel: monaco.editor.ITextModel;

    constructor(private monacoService: MonacoService) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.yamlError) {
            this.monacoService.setErrorMarker(this.editorModel, this.yamlError);
        }
    }

    public modelChange(): void {
        this.onCodeChange.emit(this.yamlTemplate);
    }
}
