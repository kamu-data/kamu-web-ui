/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatChipInputEvent } from "@angular/material/chips";

import { DatasetDataSizeFragment, DatasetOverviewFragment } from "@api/kamu.graphql.interface";
import { emitClickOnElementByDataTestId, getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { mockDatasetBasicsDerivedFragment } from "../../../../../search/mock.data";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate, mockOverviewWithSetInfo } from "../../../data-tabs.mock";
import { EditDetailsModalComponent } from "./edit-details-modal.component";

describe("EditDetailsModalComponent", () => {
    let component: EditDetailsModalComponent;
    let fixture: ComponentFixture<EditDetailsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EditDetailsModalComponent],
            providers: [
                Apollo,
                NgbActiveModal,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditDetailsModalComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.currentState = {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewDataUpdate.overview as DatasetOverviewFragment,
            size: mockOverviewDataUpdate.size as DatasetDataSizeFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check initialize details", () => {
        component.currentState = {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview: mockOverviewWithSetInfo as DatasetOverviewFragment,
            size: mockOverviewDataUpdate.size as DatasetDataSizeFragment,
        };
        fixture.detectChanges();
        component.ngOnInit();

        expect(component.keywords).toBeDefined();
        expect(component.description).toBeDefined();
    });

    it("should check commit event", () => {
        const commitSetInfoEventSpy = spyOn(component, "commitSetInfoEvent").and.stub();

        const inputKeyword = getElementByDataTestId(fixture, "input-keyword");
        component.addKeywordFromInput({
            input: inputKeyword,
            value: "keyword1",
            chipInput: {
                clear: () => undefined,
            },
        } as MatChipInputEvent);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "commit-event");

        expect(commitSetInfoEventSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add keyword", () => {
        const inputKeyword = getElementByDataTestId(fixture, "input-keyword");
        expect(component.keywords.length).toBe(0);

        component.addKeywordFromInput({
            input: inputKeyword,
            value: "keyword1",
            chipInput: {
                clear: () => undefined,
            },
        } as MatChipInputEvent);
        fixture.detectChanges();

        expect(component.keywords.length).toBe(1);
    });

    it("should check remove keyword", () => {
        const inputKeyword = getElementByDataTestId(fixture, "input-keyword");
        expect(component.keywords.length).toBe(0);

        component.addKeywordFromInput({
            input: inputKeyword,
            value: "keyword1",
            chipInput: {
                clear: () => undefined,
            },
        } as MatChipInputEvent);
        fixture.detectChanges();
        expect(component.keywords.length).toBe(1);

        component.removeKeyword("keyword1");
        fixture.detectChanges();

        expect(component.keywords.length).toBe(0);
    });
});
