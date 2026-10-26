/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";

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

    it("should emit templateChange on modelChange", () => {
        const templateChangeSpy = vi.spyOn(component.templateChange, "emit").mockImplementation(() => {});

        component.modelChange();

        expect(templateChangeSpy).toHaveBeenCalledWith(component.template);
    });

    it("should emit onEditorLoaded on onInitEditor", () => {
        const onEditorLoadedSpy = vi.spyOn(component.onEditorLoaded, "emit").mockImplementation(() => {});

        component.onInitEditor(createEditorMock());

        expect(onEditorLoadedSpy).toHaveBeenCalledWith();
    });
}
