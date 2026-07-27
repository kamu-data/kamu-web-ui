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
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "src/app/editor/components/base-editor/base-editor.component.spec";
import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { EditorModule } from "src/app/editor/editor.module";
import { editorMock } from "src/app/editor/mock/editor.mock";
import { MonacoService } from "src/app/editor/services/monaco.service";

describe("SqlEditorComponent", () => {
    let fixture: ComponentFixture<SqlEditorComponent>;
    let component: SqlEditorComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorModule, SqlEditorComponent],
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
});
