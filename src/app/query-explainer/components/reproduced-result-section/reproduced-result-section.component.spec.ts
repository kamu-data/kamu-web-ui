/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

import { ReproducedResultSectionComponent } from "src/app/query-explainer/components/reproduced-result-section/reproduced-result-section.component";
import { mockQueryExplainerEmptyOutput, mockQueryExplainerOutput } from "src/app/query-explainer/query-explainer.mocks";

describe("ReproducedResultSectionComponent", () => {
    let component: ReproducedResultSectionComponent;
    let fixture: ComponentFixture<ReproducedResultSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReproducedResultSectionComponent],
            providers: [provideToastr()],
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
