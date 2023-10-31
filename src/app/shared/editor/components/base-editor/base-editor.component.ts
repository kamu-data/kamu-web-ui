import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";

import * as monaco from "monaco-editor";
import { getDefaultError } from "../../helpers/editor-error-formatter";
import { MonacoService } from "../../services/monaco.service";
import { EditorError } from "../../models/error.model";

@Directive()
export abstract class BaseEditorComponent implements OnChanges {
    @Input() public template = "";
    @Input() public error: MaybeNull<string>;
    @Input() public height: MaybeUndefined<string>;
    @Input() public width: MaybeUndefined<string>;

    @Output() public templateChange = new EventEmitter<string>();
    @Output() public onEditorLoaded = new EventEmitter<null>();

    public editorModel: monaco.editor.ITextModel;
    public getErrorDetails: (error: string) => EditorError = getDefaultError;

    constructor(private monacoService: MonacoService) {}

    public ngOnChanges(changes: SimpleChanges) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (changes.error && this.editorModel) {
            if (this.error) {
                this.monacoService.setErrorMarker(this.editorModel, this.getErrorDetails(this.error));
            } else {
                this.monacoService.clearErrorMarker(this.editorModel);
            }
        }
    }

    public modelChange(): void {
        this.templateChange.emit(this.template);
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        this.onEditorLoaded.emit();
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        this.editorModel = editor.getModel() as monaco.editor.ITextModel;
    }
}
