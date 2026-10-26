/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";

import { CommitNavigatorComponent } from "src/app/dataset-view/additional-components/metadata-component/components/commit-navigator/commit-navigator.component";

describe("CommitNavigatorComponent", () => {
    let component: CommitNavigatorComponent;
    let fixture: ComponentFixture<CommitNavigatorComponent>;
    const INITIAL_PAGE_INDEX = 2;
    const INITIAL_LIMIT = 3;
    const INITIAL_TOTAL = 30;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommitNavigatorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommitNavigatorComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "pageIndex", INITIAL_PAGE_INDEX);
        setComponentInput(fixture, "limit", INITIAL_LIMIT);
        setComponentInput(fixture, "total", INITIAL_TOTAL);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change page backward", () => {
        const pageChangeSpy = vi.spyOn(component.pageChange, "emit").mockImplementation(() => {});
        emitClickOnElementByDataTestId(fixture, "backward-link");
        expect(pageChangeSpy).toHaveBeenCalledWith(INITIAL_PAGE_INDEX - 1);
    });

    it("should change page forward", () => {
        const pageChangeSpy = vi.spyOn(component.pageChange, "emit").mockImplementation(() => {});
        emitClickOnElementByDataTestId(fixture, "forward-link");
        expect(pageChangeSpy).toHaveBeenCalledWith(INITIAL_PAGE_INDEX + 1);
    });
});
