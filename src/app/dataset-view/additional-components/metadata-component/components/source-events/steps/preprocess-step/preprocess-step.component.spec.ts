/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    mockPreprocessStepValueWithoutQueries,
    mockSetPollingSourceEventYaml,
    mockSetPollingSourceEventYamlWithoutPreprocess,
    mockSetPollingSourceEventYamlWithQuery,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { PreprocessStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/preprocess-step/preprocess-step.component";
import { mockPreprocessStepValue } from "src/app/search/mock.data";

describe("PreprocessStepComponent", () => {
    let component: PreprocessStepComponent;
    let fixture: ComponentFixture<PreprocessStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [SharedTestModule, PreprocessStepComponent, ApolloTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(PreprocessStepComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "eventYamlByHash", mockSetPollingSourceEventYaml);
        setComponentInput(fixture, "showPreprocessStep", true);
        setComponentInput(fixture, "preprocessValue", mockPreprocessStepValue);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check switch showPreprocess checkbox", () => {
        const onCheckedPreprocessStepSpy = vi
            .spyOn(component.showPreprocessStepEmitter, "emit")
            .mockImplementation(() => {});
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
        setComponentInput(fixture, "preprocessValue", mockPreprocessStepValueWithoutQueries);
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
    });

    it("should check init default state with query", () => {
        setComponentInput(fixture, "eventYamlByHash", mockSetPollingSourceEventYamlWithQuery);
        setComponentInput(fixture, "preprocessValue", mockPreprocessStepValueWithoutQueries);
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
        expect(component.preprocessValue.queries[0].query).toBeDefined();
    });

    it("should check init default state without queries", () => {
        setComponentInput(fixture, "eventYamlByHash", mockSetPollingSourceEventYamlWithoutPreprocess);
        setComponentInput(fixture, "preprocessValue", mockPreprocessStepValueWithoutQueries);
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
    });

    it("should check the stored engine of an existing preprocess step is selected", () => {
        setComponentInput(fixture, "eventYamlByHash", mockSetPollingSourceEventYaml);
        setComponentInput(fixture, "preprocessValue", { engine: "", queries: [] });
        fixture.detectChanges();
        expect(component.preprocessValue.engine).toEqual("spark");
    });

    it("should check an engine already chosen in the editor is kept", () => {
        setComponentInput(fixture, "eventYamlByHash", mockSetPollingSourceEventYaml);
        setComponentInput(fixture, "preprocessValue", {
            engine: "flink",
            queries: [],
        });
        fixture.detectChanges();
        expect(component.preprocessValue.engine).toEqual("flink");
    });
});
