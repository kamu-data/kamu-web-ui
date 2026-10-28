/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorComponent } from "ngx-monaco-editor-v2";

import { findComponentInstance, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";

import { BaseEditorComponent } from "src/app/editor/components/base-editor/base-editor.component";
import { createEditorMock, createEditorModelMock } from "src/app/editor/mock/editor.mock";
import { MonacoService } from "src/app/editor/services/monaco.service";

export interface BaseEditorComponentTestEnvironment {
    fixture: ComponentFixture<BaseEditorComponent>;
}

export function sharedBasedEditorComponentTest(environmentFactory: () => BaseEditorComponentTestEnvironment): void {
    let component: BaseEditorComponent;
    let fixture: ComponentFixture<BaseEditorComponent>;
    let monacoService: MonacoService;

    beforeEach(() => {
        const testEnvironment: BaseEditorComponentTestEnvironment = environmentFactory();
        fixture = testEnvironment.fixture;
        component = fixture.componentInstance;
        monacoService = TestBed.inject(MonacoService);
        component.editorModel = createEditorModelMock();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("on error should call setErrorMarker", () => {
        const errorTest = "error text";
        const setErrorMarkerSpy = vi.spyOn(monacoService, "setErrorMarker").mockImplementation(() => {});

        setComponentInput(fixture, "error", errorTest);
        fixture.detectChanges();

        expect(setErrorMarkerSpy).toHaveBeenCalledTimes(1);

        expect(setErrorMarkerSpy).toHaveBeenCalledWith(component.editorModel, component.getErrorDetails(errorTest));
    });

    it("on empty error should call clearErrorMarker", () => {
        const clearErrorMarkerSpy = vi.spyOn(monacoService, "clearErrorMarker").mockImplementation(() => {});

        setComponentInput(fixture, "error", null);
        fixture.detectChanges();

        expect(clearErrorMarkerSpy).toHaveBeenCalledTimes(1);

        expect(clearErrorMarkerSpy).toHaveBeenCalledWith(component.editorModel);
    });

    /** What ngx-monaco-editor does when the editor's text changes, by the user or by its own `setValue` */
    function reportEditorText(text: string): void {
        findComponentInstance(fixture, EditorComponent).propagateChange(text);
    }

    it("should report an edit of the text", () => {
        const templateChangeSpy = stubMethod(component.templateChange, "emit");
        setComponentInput(fixture, "template", "select 1");
        fixture.detectChanges();

        reportEditorText("select 2");

        expect(templateChangeSpy).toHaveBeenCalledExactlyOnceWith("select 2");
    });

    it("should report an edit back to the text it was given", () => {
        const templateChangeSpy = stubMethod(component.templateChange, "emit");
        setComponentInput(fixture, "template", "select 1");
        fixture.detectChanges();

        reportEditorText("select 12");
        reportEditorText("select 1");

        expect(templateChangeSpy).toHaveBeenNthCalledWith(2, "select 1");
    });

    it("should not report the text it was given as an edit when the editor shows it", () => {
        const templateChangeSpy = stubMethod(component.templateChange, "emit");
        setComponentInput(fixture, "template", "select 1");
        fixture.detectChanges();

        reportEditorText("select 1");

        expect(templateChangeSpy).not.toHaveBeenCalled();
    });

    it("should emit onEditorLoaded on onInitEditor", () => {
        const onEditorLoadedSpy = vi.spyOn(component.onEditorLoaded, "emit").mockImplementation(() => {});

        component.onInitEditor(createEditorMock());

        expect(onEditorLoadedSpy).toHaveBeenCalledWith();
    });
}
