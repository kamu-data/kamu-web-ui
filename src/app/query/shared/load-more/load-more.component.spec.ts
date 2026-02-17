/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { LoadMoreComponent } from "src/app/query/shared/load-more/load-more.component";

import {
    dispatchInputEvent,
    emitClickOnElement,
    emitClickOnElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

describe("LoadMoreComponent", () => {
    let component: LoadMoreComponent;
    let fixture: ComponentFixture<LoadMoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadMoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadMoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change number of rows on button click", fakeAsync(() => {
        const options = component.ROWS_OPTIONS;
        expect(component.rowsNumber).toEqual(AppValues.SQL_QUERY_LIMIT);
        emitClickOnElement(fixture, `[data-test-id="row-limit-${options[0]}"] button`);
        expect(component.rowsNumber).toEqual(options[0]);
    }));

    it("should change number of rows on new input value", fakeAsync(() => {
        const newRowsNumber = 76;
        expect(component.rowsNumber).toEqual(AppValues.SQL_QUERY_LIMIT);
        dispatchInputEvent(fixture, "row-limit-input", newRowsNumber.toString());
        expect(component.rowsNumber).toEqual(newRowsNumber);
    }));

    it("button click should emmit output with default limit", () => {
        const defaultLimit = AppValues.SQL_QUERY_LIMIT;
        const loadMoreEmit = spyOn(component.loadMoreEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "btn-load-more");
        expect(loadMoreEmit).toHaveBeenCalledWith(defaultLimit);
    });
});
