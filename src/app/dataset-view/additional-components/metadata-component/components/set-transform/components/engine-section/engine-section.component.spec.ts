/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { mockSetPollingSourceEvent } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import { EngineSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.component";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";

import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { EngineDesc } from "@api/kamu.graphql.interface";

describe("EngineSectionComponent", () => {
    let component: EngineSectionComponent;
    let fixture: ComponentFixture<EngineSectionComponent>;
    let engineService: EngineService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [SharedTestModule, EngineSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSectionComponent);
        component = fixture.componentInstance;
        engineService = TestBed.inject(EngineService);
        component.knownEngines = mockEngines.data.knownEngines;
        spyOn(engineService, "engines").and.returnValue(of(mockEngines));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    [
        { testCase: "spark", expected: mockEngines.data.knownEngines[0] },
        { testCase: "flink", expected: mockEngines.data.knownEngines[1] },
        { testCase: "datafusion", expected: mockEngines.data.knownEngines[2] },
        { testCase: "risingwave", expected: mockEngines.data.knownEngines[3] },
    ].forEach((item: { testCase: string; expected: EngineDesc }) => {
        it(`should check init ${item.testCase} engine and image`, fakeAsync(() => {
            component.selectedEngine = item.testCase;
            component.ngOnInit();
            tick();
            const image = findElementByDataTestId(fixture, "engine-image") as HTMLInputElement;
            expect(image.value).toEqual(item.expected.latestImage);
            expect(component.selectedEngine.toUpperCase()).toBe(item.expected.name.toUpperCase());
            expect(component.selectedImage).toBe(item.expected.latestImage);
            flush();
        }));
    });

    it("should check init engine and image when currentSetTransformEvent is not null", fakeAsync(() => {
        component.currentSetTransformEvent = mockSetPollingSourceEvent.preprocess;
        component.selectedEngine = "spark";
        fixture.detectChanges();
        component.ngOnInit();
        tick();
        if (mockSetPollingSourceEvent.preprocess)
            expect(component.selectedEngine).toBe(mockSetPollingSourceEvent.preprocess.engine);
        flush();
    }));

    it("should check init engine and image when currentSetTransformEvent is null", fakeAsync(() => {
        component.currentSetTransformEvent = null;
        component.selectedEngine = "";
        fixture.detectChanges();
        component.ngOnInit();
        tick();

        expect(component.selectedEngine).toBe(AppValues.DEFAULT_ENGINE_NAME);
        flush();
    }));
});
