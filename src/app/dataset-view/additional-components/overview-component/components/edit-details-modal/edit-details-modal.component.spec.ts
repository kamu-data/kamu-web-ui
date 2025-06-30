/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingModule } from "apollo-angular/testing";
import { emitClickOnElementByDataTestId, getElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { FormsModule } from "@angular/forms";
import { mockDatasetBasicsDerivedFragment } from "../../../../../search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EditDetailsModalComponent } from "./edit-details-modal.component";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate, mockOverviewWithSetInfo } from "../../../data-tabs.mock";
import { DatasetDataSizeFragment, DatasetOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("EditDetailsModalComponent", () => {
    let component: EditDetailsModalComponent;
    let fixture: ComponentFixture<EditDetailsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [
        ApolloModule,
        ApolloTestingModule,
        FormsModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        HttpClientTestingModule,
        SharedTestModule,
        EditDetailsModalComponent,
    ],
    providers: [Apollo, NgbActiveModal],
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
