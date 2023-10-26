import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";

import * as monaco from "monaco-editor";

@Directive()
export abstract class BaseEditorComponent {
    @Input() public template = "";
    @Input() public error: MaybeNull<string>;
    @Input() public height: MaybeUndefined<string>;
    @Input() public width: MaybeUndefined<string>;

    @Output() public templateChange = new EventEmitter<string>();

    public editorModel: monaco.editor.ITextModel;
}
