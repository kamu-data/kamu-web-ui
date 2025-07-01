/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import * as monaco from "monaco-editor";
import { getMonacoNamespace } from "../../services/monaco.service";
import { BaseEditorComponent } from "../base-editor/base-editor.component";
import { getSqlError } from "../../helpers/editor-error-formatter";
import { fromEvent, filter, take, Subscription, takeWhile } from "rxjs";
import { EditorComponent, MonacoEditorModule } from "ngx-monaco-editor-v2";
import AppValues from "src/app/common/values/app.values";
import { FormsModule } from "@angular/forms";
import { NgStyle, NgIf } from "@angular/common";

const SQL_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "vs",
    language: "sql",
    renderLineHighlight: "none",
    minimap: {
        enabled: false,
    },
    scrollPredominantAxis: true,
    scrollBeyondLastLine: false,
    tabSize: 2,
    automaticLayout: true,
    scrollbar: {
        verticalHasArrows: true,
        useShadows: false,
    },
};

@Component({
    selector: "app-sql-editor",
    templateUrl: "./sql-editor.component.html",
    styleUrls: ["./sql-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MonacoEditorModule, NgStyle, FormsModule, NgIf],
})
export class SqlEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
    public readonly EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = SQL_EDITOR_OPTIONS;
    public getErrorDetails = getSqlError;
    @Output() public onRunSql = new EventEmitter<null>();
    @Input() public placeholder = AppValues.DEFAULT_MONACO_EDITOR_PLACEHOLDER;
    @ViewChild("monacoEditor") private monaco: EditorComponent;

    private cdr = inject(ChangeDetectorRef);
    private readonly INITIAL_EDITOR_HEIGHT = 200;
    private readonly EDITOR_VERTICAL_PADDINGS = 30;

    private rectOld: DOMRect | undefined;
    private origin: {
        x: number;
        y: number;
    };
    private moveSubscription: Subscription | undefined;
    private div: HTMLElement | null;
    private alive: boolean = true;

    public ngOnInit(): void {
        /* istanbul ignore next */
        fromEvent(document, "mousedown")
            .pipe(
                takeWhile(() => this.alive),
                filter((event) => {
                    const className = (event.target as HTMLDivElement).className;
                    if (className && typeof className === "string") {
                        return className == "cell-border-bottom";
                    }
                    return false;
                }),
            )
            .subscribe((event) => {
                const mouseEvent = event as MouseEvent;
                this.div = (event.target as HTMLDivElement).parentElement;
                this.rectOld = this.div?.getBoundingClientRect();
                this.origin = { x: mouseEvent.screenX, y: mouseEvent.screenY };
                fromEvent(document, "mouseup")
                    .pipe(take(1))
                    .subscribe(() => {
                        if (this.moveSubscription) {
                            this.moveSubscription.unsubscribe();
                            this.moveSubscription = undefined;
                        }
                    });
                if (!this.moveSubscription && this.div) {
                    this.moveSubscription = fromEvent(document, "mousemove").subscribe((moveEvent) => {
                        const incrTop = (moveEvent as MouseEvent).screenY - this.origin.y;
                        if (this.rectOld && this.div) {
                            const heigth = this.rectOld.height + incrTop;
                            this.div.style.height =
                                (heigth < this.INITIAL_EDITOR_HEIGHT ? this.INITIAL_EDITOR_HEIGHT : heigth) + "px";
                            this.height =
                                (heigth < this.INITIAL_EDITOR_HEIGHT
                                    ? this.INITIAL_EDITOR_HEIGHT - this.EDITOR_VERTICAL_PADDINGS
                                    : heigth - this.EDITOR_VERTICAL_PADDINGS) + "px";
                            this.cdr.detectChanges();
                        }
                    });
                }
            });
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        super.onInitEditor(editor);

        const runQueryFn = () => {
            this.onRunSql.emit();
        };

        const monaco = getMonacoNamespace();
        /* istanbul ignore else */
        if (monaco) {
            editor.addAction({
                // An unique identifier of the contributed action.
                id: "run-sql",
                // A label of the action that will be presented to the user.
                label: "Run SQL",
                // An optional array of keybindings for the action.
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                contextMenuGroupId: "navigation",
                contextMenuOrder: 1.5,
                // Method that will be executed when the action is triggered.
                // @param editor The editor instance is passed in as a convenience
                run: runQueryFn,
            });
        }
    }

    public clickPlaceholder(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        this.monaco["_editor"].focus();
    }

    public ngOnDestroy() {
        this.alive = false;
    }
}
