/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PreprocessStepComponent } from "./preprocess-step.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    mockPreprocessStepValue,
    mockPreprocessStepValueWithoutQueries,
    mockSetPollingSourceEventYaml,
    mockSetPollingSourceEventYamlWithQuery,
    mockSetPollingSourceEventYamlWithoutPreprocess,
} from "../../../set-transform/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { ChangeDetectionStrategy } from "@angular/core";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { EditorModule } from "src/app/editor/editor.module";

describe("PreprocessStepComponent", () => {
    let component: PreprocessStepComponent;
    let fixture: ComponentFixture<PreprocessStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, PreprocessStepComponent, EditorModule],
        })
            .overrideComponent(PreprocessStepComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(PreprocessStepComponent);
        component = fixture.componentInstance;
        component.eventYamlByHash = mockSetPollingSourceEventYaml;
        component.showPreprocessStep = true;
        component.preprocessValue = mockPreprocessStepValue;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check switch showPreprocess checkbox", () => {
        const onCheckedPreprocessStepSpy = spyOn(component.showPreprocessStepEmitter, "emit");
        emitClickOnElementByDataTestId(fixture, "showPreprocessStep");
        expect(onCheckedPreprocessStepSpy).toHaveBeenCalledTimes(1);
    });

    it("should check select engine", () => {
        fixture.detectChanges();
        const selectedEngine = "FLINK";
        expect(component.preprocessValue.engine).toEqual(mockPreprocessStepValue.engine);
        component.onSelectEngine(selectedEngine);
        expect(component.preprocessValue.engine).toEqual(selectedEngine);
    });

    it("should check init default state with queries", () => {
        component.preprocessValue = mockPreprocessStepValueWithoutQueries;
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
    });

    it("should check init default state with query", () => {
        component.eventYamlByHash = mockSetPollingSourceEventYamlWithQuery;
        component.preprocessValue = mockPreprocessStepValueWithoutQueries;
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
        expect(component.preprocessValue.queries[0].query).toBeDefined();
    });

    it("should check init default state without queries", () => {
        component.eventYamlByHash = mockSetPollingSourceEventYamlWithoutPreprocess;
        component.preprocessValue = mockPreprocessStepValueWithoutQueries;
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
    });
});
