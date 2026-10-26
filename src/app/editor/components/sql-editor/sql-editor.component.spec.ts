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
    createSpyObj,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { MaybeUndefined } from "@interface/app.types";

import {
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "src/app/editor/components/base-editor/base-editor.component.spec";
import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { createEditorMock } from "src/app/editor/mock/editor.mock";
import { MonacoService } from "src/app/editor/services/monaco.service";

/** The part of the Monaco namespace the SQL editor reads from `window` to build its keybindings */
interface MonacoKeyCodes {
    KeyCode: {
        Enter: number;
    };
    KeyMod: {
        CtrlCmd: number;
    };
}

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

    function selectionChangedEvent(isEmpty: boolean): monaco.editor.ICursorSelectionChangedEvent {
        return {
            selection: createSpyObj<monaco.Selection>({ isEmpty }),
            secondarySelections: [],
            modelVersionId: 1,
            oldSelections: null,
            oldModelVersionId: 1,
            source: "keyboard",
            reason: 0,
        };
    }

    it("should run SQL action inside Angular zone", () => {
        const ngZone = TestBed.inject(NgZone);
        const ngZoneRunSpy = vi.spyOn(ngZone, "run");
        const actions: monaco.editor.IActionDescriptor[] = [];
        const editor = createEditorMock();
        editor.addAction.mockImplementation((action: monaco.editor.IActionDescriptor): monaco.IDisposable => {
            actions.push(action);
            return { dispose: () => undefined };
        });
        const windowWithMonaco: typeof window & {
            monaco?: MonacoKeyCodes;
        } = window;
        const originalMonaco = windowWithMonaco.monaco;
        windowWithMonaco.monaco = {
            KeyCode: { Enter: 3 },
            KeyMod: { CtrlCmd: 2048 },
        };

        component.onInitEditor(editor);
        const runSqlAction = actions.find((action) => action.id === "run-sql");

        void runSqlAction?.run(editor);
        windowWithMonaco.monaco = originalMonaco;

        expect(runSqlAction).toBeDefined();
        expect(ngZoneRunSpy).toHaveBeenCalled();
    });

    describe("run actions", () => {
        const windowWithMonaco: typeof window & {
            monaco?: MonacoKeyCodes;
        } = window;
        let originalMonaco: MaybeUndefined<MonacoKeyCodes>;
        let actions: monaco.editor.IActionDescriptor[];
        let selectionListener: (e: monaco.editor.ICursorSelectionChangedEvent) => void;
        let hasSelectionValues: monaco.editor.ContextKeyValue[];

        function initEditorWithSelectedText(selectedText: string): monaco.editor.IStandaloneCodeEditor {
            const editor = createEditorMock(selectedText);
            editor.addAction.mockImplementation((action: monaco.editor.IActionDescriptor): monaco.IDisposable => {
                actions.push(action);
                return { dispose: () => undefined };
            });
            editor.createContextKey.mockImplementation(
                <T extends monaco.editor.ContextKeyValue>(
                    _: string,
                    defaultValue: T,
                ): monaco.editor.IContextKey<T> => ({
                    set: (value: T) => hasSelectionValues.push(value),
                    reset: () => undefined,
                    get: () => defaultValue,
                }),
            );
            editor.onDidChangeCursorSelection.mockImplementation(
                (listener: (e: monaco.editor.ICursorSelectionChangedEvent) => void): monaco.IDisposable => {
                    selectionListener = listener;
                    return { dispose: () => undefined };
                },
            );
            component.onInitEditor(editor);
            return editor;
        }

        function action(id: string): monaco.editor.IActionDescriptor {
            const found = actions.find((a) => a.id === id);
            if (!found) {
                throw new Error(`The editor got no action "${id}"`);
            }
            return found;
        }

        beforeEach(() => {
            actions = [];
            hasSelectionValues = [];
            originalMonaco = windowWithMonaco.monaco;
            windowWithMonaco.monaco = {
                KeyCode: { Enter: 3 },
                KeyMod: { CtrlCmd: 2048 },
            };
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
            const onRunSqlSpy = vi.spyOn(component.onRunSql, "emit").mockImplementation(() => {});

            void action("run-sql").run(editor);

            expect(onRunSqlSpy).toHaveBeenCalledTimes(1);

            expect(onRunSqlSpy).toHaveBeenCalledWith();
        });

        it("should check run selection emits the selected text", () => {
            const editor = initEditorWithSelectedText("select 1");
            const onRunSqlSpy = vi.spyOn(component.onRunSql, "emit").mockImplementation(() => {});

            void action("run-selected-sql").run(editor);

            expect(onRunSqlSpy).toHaveBeenCalledTimes(1);

            expect(onRunSqlSpy).toHaveBeenCalledWith("select 1");
        });

        it("should check selection changes toggle the hasSelection context key", () => {
            initEditorWithSelectedText("");

            selectionListener(selectionChangedEvent(false));
            selectionListener(selectionChangedEvent(true));

            expect(hasSelectionValues).toEqual([true, false]);
        });
    });

    describe("placeholder", () => {
        it("should check placeholder is shown for an empty query", () => {
            setComponentInput(fixture, "template", "");
            setComponentInput(fixture, "placeholder", "Type your SQL here");
            fixture.detectChanges();

            const placeholder = findElementByDataTestId(fixture, "sql-editor-placeholder");
            expect(placeholder?.textContent?.trim()).toEqual("Type your SQL here");
        });

        it("should check placeholder is hidden once there is a query", () => {
            setComponentInput(fixture, "template", "select 1");
            fixture.detectChanges();

            checkVisible(fixture, "sql-editor-placeholder", false);
        });

        it("should check clicking the placeholder focuses the editor", () => {
            const focusSpy = vi.fn();
            component.onInitEditor({ ...createEditorMock(), focus: focusSpy });
            setComponentInput(fixture, "template", "");
            fixture.detectChanges();

            emitClickOnElementByDataTestId(fixture, "sql-editor-placeholder");

            expect(focusSpy).toHaveBeenCalledTimes(1);

            expect(focusSpy).toHaveBeenCalledWith();
        });

        it("should check clicking the placeholder before the editor loads does nothing", () => {
            setComponentInput(fixture, "template", "");
            fixture.detectChanges();

            expect(() => emitClickOnElementByDataTestId(fixture, "sql-editor-placeholder")).not.toThrow();
        });
    });
});
