import { Directive, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";

import * as monaco from "monaco-editor";
import { getSqlError } from "../../helpers/editor-error-formatter";
import { MonacoService } from "../../services/monaco.service";

@Directive()
export abstract class BaseEditorComponent implements OnChanges {
    @Input() public template = "";
    @Input() public error: MaybeNull<string>;
    @Input() public height: MaybeUndefined<string>;
    @Input() public width: MaybeUndefined<string>;

    @Output() public templateChange = new EventEmitter<string>();
    @Output() public onEditorLoaded = new EventEmitter<null>();

    public editorModel: monaco.editor.ITextModel;

    constructor(private monacoService: MonacoService) {}

    public ngOnChanges(changes: SimpleChanges) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (changes.error) {
            if (this.error) {
                this.monacoService.setErrorMarker(this.editorModel, getSqlError(this.error));
            }

            if (!this.error) {
                this.monacoService.clearErrorMarker(this.editorModel);
            }
        }
    }

    public modelChange(): void {
        this.templateChange.emit(this.template);
    }
}
