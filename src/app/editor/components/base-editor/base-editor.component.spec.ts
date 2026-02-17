/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BaseEditorComponent } from "src/app/editor/components/base-editor/base-editor.component";
import { editorMock, editorModelMock } from "src/app/editor/mock/editor.mock";
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
        component.editorModel = editorModelMock;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("on error should call setErrorMarker", () => {
        const errorTest = "error text";
        const simpleChanges = {
            error: new SimpleChange(undefined, errorTest, true),
        };
        const setErrorMarkerSpy = spyOn(monacoService, "setErrorMarker");

        component.error = errorTest;
        fixture.detectChanges();
        component.ngOnChanges(simpleChanges);

        expect(setErrorMarkerSpy).toHaveBeenCalledOnceWith(component.editorModel, component.getErrorDetails(errorTest));
    });

    it("on empty error should call clearErrorMarker", () => {
        const simpleChanges = {
            error: new SimpleChange("some value", null, false),
        };

        const clearErrorMarkerSpy = spyOn(monacoService, "clearErrorMarker");

        component.error = null;
        fixture.detectChanges();
        component.ngOnChanges(simpleChanges);

        expect(clearErrorMarkerSpy).toHaveBeenCalledOnceWith(component.editorModel);
    });

    it("should emit templateChange on modelChange", () => {
        const templateChangeSpy = spyOn(component.templateChange, "emit");

        component.modelChange();

        expect(templateChangeSpy).toHaveBeenCalledWith(component.template);
    });

    it("should emit onEditorLoaded on onInitEditor", () => {
        const onEditorLoadedSpy = spyOn(component.onEditorLoaded, "emit");

        component.onInitEditor(editorMock);

        expect(onEditorLoadedSpy).toHaveBeenCalledWith();
    });
}
