/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

import { LoadMoreComponent } from "src/app/query/shared/load-more/load-more.component";
import { LoadMoreHarness } from "src/app/query/shared/load-more/load-more.harness";

describe("LoadMoreComponent", () => {
    let component: LoadMoreComponent;
    let fixture: ComponentFixture<LoadMoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadMoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadMoreComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "isAllDataLoaded", false);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    function loadMoreHarness(): Promise<LoadMoreHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, LoadMoreHarness);
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change number of rows on button click", async () => {
        const options = component.ROWS_OPTIONS;
        const loadMore = await loadMoreHarness();
        expect(await loadMore.getRowLimit()).toBe(String(AppValues.SQL_QUERY_LIMIT));

        await loadMore.selectRowLimitOption(options[0]);

        expect(component.rowsControl.value).toEqual(options[0]);
        expect(await loadMore.getRowLimit()).toBe(String(options[0]));
    });

    it("should load the number of rows entered", async () => {
        const loadMoreEmit = stubMethod(component.loadMoreEmit, "emit");
        const loadMore = await loadMoreHarness();

        await loadMore.setRowLimit("76");
        expect(await loadMore.getRowLimitError()).toBeNull();
        expect(await loadMore.isLoadMoreDisabled()).toBe(false);
        await loadMore.loadMore();

        expect(loadMoreEmit).toHaveBeenCalledWith(76);
    });

    it("button click should emmit output with default limit", async () => {
        const loadMoreEmit = stubMethod(component.loadMoreEmit, "emit");
        const loadMore = await loadMoreHarness();

        await loadMore.loadMore();

        expect(loadMoreEmit).toHaveBeenCalledWith(AppValues.SQL_QUERY_LIMIT);
    });

    it("should load a single row", async () => {
        const loadMoreEmit = stubMethod(component.loadMoreEmit, "emit");
        const loadMore = await loadMoreHarness();

        await loadMore.setRowLimit("1");
        expect(await loadMore.getRowLimitError()).toBeNull();
        await loadMore.loadMore();

        expect(loadMoreEmit).toHaveBeenCalledWith(1);
    });

    [
        { rows: "", message: "Number of rows is required" },
        { rows: "0", message: "Number of rows must be at least 1" },
        { rows: "-5", message: "Number of rows must be at least 1" },
        { rows: "2.5", message: "Number of rows must be a whole number" },
    ].forEach(({ rows, message }) => {
        it(`should not load "${rows}" rows`, async () => {
            const loadMoreEmit = stubMethod(component.loadMoreEmit, "emit");
            const loadMore = await loadMoreHarness();

            await loadMore.setRowLimit(rows);
            expect(await loadMore.getRowLimitError()).toBe(message);
            expect(await loadMore.isLoadMoreDisabled()).toBe(true);
            await loadMore.loadMore();

            expect(loadMoreEmit).not.toHaveBeenCalled();
        });
    });

    it("should show and hide the row options", async () => {
        const loadMore = await loadMoreHarness();
        expect(await loadMore.areOptionsShown()).toBe(false);

        await loadMore.toggleOptions();
        expect(await loadMore.areOptionsShown()).toBe(true);

        await loadMore.toggleOptions();
        expect(await loadMore.areOptionsShown()).toBe(false);
    });

    it("should load nothing more once all data is loaded", async () => {
        setComponentInput(fixture, "isAllDataLoaded", true);
        const loadMore = await loadMoreHarness();

        expect(await loadMore.isLoadMoreDisabled()).toBe(true);
    });
});
