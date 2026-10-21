/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgZone } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import type * as monaco from "monaco-editor";

import {
    checkVisible,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import { MaybeUndefined } from "@interface/app.types";

import {
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "src/app/editor/components/base-editor/base-editor.component.spec";
import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { editorMock } from "src/app/editor/mock/editor.mock";
import { MonacoService } from "src/app/editor/services/monaco.service";

describe("SqlEditorComponent", () => {
    let fixture: ComponentFixture<SqlEditorComponent>;
    let component: SqlEditorComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SqlEditorComponent],
            providers: [MonacoService],
        }).compileComponents();

        fixture = TestBed.createComponent(SqlEditorComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    function createTestEnvironment(): BaseEditorComponentTestEnvironment {
        return {
            fixture,
        };
    }

    sharedBasedEditorComponentTest(createTestEnvironment);

    it("should run SQL action inside Angular zone", () => {
        const ngZone = TestBed.inject(NgZone);
        const ngZoneRunSpy = spyOn(ngZone, "run").and.callThrough();
        const actions: monaco.editor.IActionDescriptor[] = [];
        const editor = {
            ...editorMock,
            addAction: (action: monaco.editor.IActionDescriptor): monaco.IDisposable => {
                actions.push(action);
                return { dispose: () => undefined };
            },
            getModel: () =>
                ({
                    getValueInRange: () => "",
                }) as unknown as monaco.editor.ITextModel,
        } as monaco.editor.IStandaloneCodeEditor;
        const windowWithMonaco = window as typeof window & { monaco?: typeof monaco };
        const originalMonaco = windowWithMonaco.monaco;
        windowWithMonaco.monaco = {
            KeyCode: { Enter: 3 },
            KeyMod: { CtrlCmd: 2048 },
        } as unknown as typeof monaco;

        component.onInitEditor(editor);
        const runSqlAction = actions.find((action) => action.id === "run-sql");

        void runSqlAction?.run(editor);
        windowWithMonaco.monaco = originalMonaco;

        expect(runSqlAction).toBeDefined();
        expect(ngZoneRunSpy).toHaveBeenCalled();
    });

    describe("run actions", () => {
        const windowWithMonaco = window as typeof window & { monaco?: typeof monaco };
        let originalMonaco: MaybeUndefined<typeof monaco>;
        let actions: monaco.editor.IActionDescriptor[];
        let selectionListener: (e: monaco.editor.ICursorSelectionChangedEvent) => void;
        let hasSelectionValues: boolean[];

        function initEditorWithSelectedText(selectedText: string): monaco.editor.IStandaloneCodeEditor {
            const editor = {
                ...editorMock,
                addAction: (action: monaco.editor.IActionDescriptor): monaco.IDisposable => {
                    actions.push(action);
                    return { dispose: () => undefined };
                },
                createContextKey: (_: string, defaultValue: boolean): monaco.editor.IContextKey<boolean> => ({
                    set: (value: boolean) => hasSelectionValues.push(value),
                    reset: () => undefined,
                    get: () => defaultValue,
                }),
                onDidChangeCursorSelection: (
                    listener: (e: monaco.editor.ICursorSelectionChangedEvent) => void,
                ): monaco.IDisposable => {
                    selectionListener = listener;
                    return { dispose: () => undefined };
                },
                getModel: () =>
                    ({
                        getValueInRange: () => selectedText,
                    }) as unknown as monaco.editor.ITextModel,
            } as monaco.editor.IStandaloneCodeEditor;
            component.onInitEditor(editor);
            return editor;
        }

        function action(id: string): monaco.editor.IActionDescriptor {
            const found = actions.find((a) => a.id === id);
            expect(found).toBeDefined();
            return found as monaco.editor.IActionDescriptor;
        }

        beforeEach(() => {
            actions = [];
            hasSelectionValues = [];
            originalMonaco = windowWithMonaco.monaco;
            windowWithMonaco.monaco = {
                KeyCode: { Enter: 3 },
                KeyMod: { CtrlCmd: 2048 },
            } as unknown as typeof monaco;
        });

        afterEach(() => {
            windowWithMonaco.monaco = originalMonaco;
        });

        it("should check Ctrl+Enter runs the selection when there is one and the whole query otherwise", () => {
            initEditorWithSelectedText("");

            const ctrlEnter = 2048 | 3;
            expect(action("run-selected-sql").precondition).toEqual("hasSelection");
            expect(action("run-selected-sql").keybindings).toEqual([ctrlEnter]);
            expect(action("run-sql").precondition).toEqual("!hasSelection");
            expect(action("run-sql").keybindings).toEqual([ctrlEnter]);
        });

        it("should check run SQL without a selection emits no query text", () => {
            const editor = initEditorWithSelectedText("");
            const onRunSqlSpy = spyOn(component.onRunSql, "emit");

            void action("run-sql").run(editor);

            expect(onRunSqlSpy).toHaveBeenCalledOnceWith();
        });

        it("should check run selection emits the selected text", () => {
            const editor = initEditorWithSelectedText("select 1");
            const onRunSqlSpy = spyOn(component.onRunSql, "emit");

            void action("run-selected-sql").run(editor);

            expect(onRunSqlSpy).toHaveBeenCalledOnceWith("select 1");
        });

        it("should check selection changes toggle the hasSelection context key", () => {
            initEditorWithSelectedText("");

            selectionListener({ selection: { isEmpty: () => false } } as monaco.editor.ICursorSelectionChangedEvent);
            selectionListener({ selection: { isEmpty: () => true } } as monaco.editor.ICursorSelectionChangedEvent);

            expect(hasSelectionValues).toEqual([true, false]);
        });
    });

    describe("placeholder", () => {
        it("should check placeholder is shown for an empty query", () => {
            fixture.componentRef.setInput("template", "");
            fixture.componentRef.setInput("placeholder", "Type your SQL here");
            fixture.detectChanges();

            const placeholder = findElementByDataTestId(fixture, "sql-editor-placeholder");
            expect(placeholder?.textContent?.trim()).toEqual("Type your SQL here");
        });

        it("should check placeholder is hidden once there is a query", () => {
            fixture.componentRef.setInput("template", "select 1");
            fixture.detectChanges();

            checkVisible(fixture, "sql-editor-placeholder", false);
        });

        it("should check clicking the placeholder focuses the editor", () => {
            const focusSpy = jasmine.createSpy("focus");
            component.onInitEditor({ ...editorMock, focus: focusSpy });
            fixture.componentRef.setInput("template", "");
            fixture.detectChanges();

            emitClickOnElementByDataTestId(fixture, "sql-editor-placeholder");

            expect(focusSpy).toHaveBeenCalledOnceWith();
        });

        it("should check clicking the placeholder before the editor loads does nothing", () => {
            fixture.componentRef.setInput("template", "");
            fixture.detectChanges();

            expect(() => emitClickOnElementByDataTestId(fixture, "sql-editor-placeholder")).not.toThrow();
        });
    });
});
