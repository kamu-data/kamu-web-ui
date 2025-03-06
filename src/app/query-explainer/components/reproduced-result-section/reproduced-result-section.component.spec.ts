/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReproducedResultSectionComponent } from "./reproduced-result-section.component";
import { DynamicTableModule } from "src/app/common/components/dynamic-table/dynamic-table.module";
import { mockQueryExplainerEmptyOutput, mockQueryExplainerOutput } from "../../query-explainer.mocks";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("ReproducedResultSectionComponent", () => {
    let component: ReproducedResultSectionComponent;
    let fixture: ComponentFixture<ReproducedResultSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReproducedResultSectionComponent],
            imports: [DynamicTableModule],
        });
        fixture = TestBed.createComponent(ReproducedResultSectionComponent);
        component = fixture.componentInstance;
        component.dataJsonAoS = mockQueryExplainerOutput;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check empty data result", () => {
        component.dataJsonAoS = mockQueryExplainerEmptyOutput;
        fixture.detectChanges();
        const emptyElement = findElementByDataTestId(fixture, "emptyResult");
        expect(emptyElement?.textContent?.trim()).toEqual("0 records");
    });
});
