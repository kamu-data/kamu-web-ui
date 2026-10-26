/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatChipInput, MatChipInputEvent } from "@angular/material/chips";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import {
    createSpyObj,
    emitClickOnElementByDataTestId,
    getInputElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewWithSetInfo,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EditDetailsModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/edit-details-modal/edit-details-modal.component";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";

describe("EditDetailsModalComponent", () => {
    let component: EditDetailsModalComponent;
    let fixture: ComponentFixture<EditDetailsModalComponent>;

    function keywordInputEvent(value: string): MatChipInputEvent {
        return {
            input: getInputElementByDataTestId(fixture, "input-keyword"),
            value,
            chipInput: createSpyObj<MatChipInput>({ clear: undefined }),
        };
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EditDetailsModalComponent],
            providers: [Apollo, NgbActiveModal, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(EditDetailsModalComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(fixture, "currentState", {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewDataUpdate.overview,
            size: mockOverviewDataUpdate.size,
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initialize details", () => {
        fixture = TestBed.createComponent(EditDetailsModalComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(fixture, "currentState", {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewWithSetInfo,
            size: mockOverviewDataUpdate.size,
        });
        fixture.detectChanges();

        expect(component.keywords).toEqual(["mock1", "mock2"]);
        expect(component.description).toEqual("mock description");
    });

    it("should check commit event", () => {
        const commitSetInfoEventSpy = vi.spyOn(component, "commitSetInfoEvent").mockImplementation(() => {});

        component.addKeywordFromInput(keywordInputEvent("keyword1"));
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "commit-event");

        expect(commitSetInfoEventSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add keyword", () => {
        expect(component.keywords.length).toBe(0);

        component.addKeywordFromInput(keywordInputEvent("keyword1"));
        fixture.detectChanges();

        expect(component.keywords.length).toBe(1);
    });

    it("should check remove keyword", () => {
        expect(component.keywords.length).toBe(0);

        component.addKeywordFromInput(keywordInputEvent("keyword1"));
        fixture.detectChanges();
        expect(component.keywords.length).toBe(1);

        component.removeKeyword("keyword1");
        fixture.detectChanges();

        expect(component.keywords.length).toBe(0);
    });
});
