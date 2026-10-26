/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    mockPreprocessStepValueWithoutQueries,
    mockSetPollingSourceEventYaml,
    mockSetPollingSourceEventYamlWithoutPreprocess,
    mockSetPollingSourceEventYamlWithQuery,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { PreprocessStepValue } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
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
        fixture.componentRef.setInput("eventYamlByHash", mockSetPollingSourceEventYaml);
        fixture.componentRef.setInput("showPreprocessStep", true);
        fixture.componentRef.setInput("preprocessValue", mockPreprocessStepValue);
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
        fixture.componentRef.setInput("preprocessValue", mockPreprocessStepValueWithoutQueries);
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
    });

    it("should check init default state with query", () => {
        fixture.componentRef.setInput("eventYamlByHash", mockSetPollingSourceEventYamlWithQuery);
        fixture.componentRef.setInput("preprocessValue", mockPreprocessStepValueWithoutQueries);
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
        expect(component.preprocessValue.queries[0].query).toBeDefined();
    });

    it("should check init default state without queries", () => {
        fixture.componentRef.setInput("eventYamlByHash", mockSetPollingSourceEventYamlWithoutPreprocess);
        fixture.componentRef.setInput("preprocessValue", mockPreprocessStepValueWithoutQueries);
        fixture.detectChanges();
        expect(component.preprocessValue.queries.length).toEqual(1);
    });

    it("should check the stored engine of an existing preprocess step is selected", () => {
        fixture.componentRef.setInput("eventYamlByHash", mockSetPollingSourceEventYaml);
        fixture.componentRef.setInput("preprocessValue", { engine: "", queries: [] } satisfies PreprocessStepValue);
        fixture.detectChanges();
        expect(component.preprocessValue.engine).toEqual("spark");
    });

    it("should check an engine already chosen in the editor is kept", () => {
        fixture.componentRef.setInput("eventYamlByHash", mockSetPollingSourceEventYaml);
        fixture.componentRef.setInput("preprocessValue", {
            engine: "flink",
            queries: [],
        } satisfies PreprocessStepValue);
        fixture.detectChanges();
        expect(component.preprocessValue.engine).toEqual("flink");
    });
});
