import { EventEmitter, Injectable, Input, Output } from "@angular/core";
import { MaybeNull } from "src/app/common/app.types";

import * as monaco from "monaco-editor";

@Injectable()
export abstract class BaseEditorComponent {
    @Input() public template = "";
    @Input() public error: MaybeNull<string>;
    @Input() public height: MaybeNull<number> = null;
    @Input() public width: MaybeNull<number> = null;

    @Output() public templateChange = new EventEmitter<string>();

    public editorModel: monaco.editor.ITextModel;
}
