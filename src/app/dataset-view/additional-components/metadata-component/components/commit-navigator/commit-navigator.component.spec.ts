/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommitNavigatorComponent } from "./commit-navigator.component";
import { MatIconModule } from "@angular/material/icon";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("CommitNavigatorComponent", () => {
    let component: CommitNavigatorComponent;
    let fixture: ComponentFixture<CommitNavigatorComponent>;
    const INITIAL_PAGE_INDEX = 2;
    const INITIAL_LIMIT = 3;
    const INITIAL_TOTAL = 30;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommitNavigatorComponent],
            imports: [MatIconModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CommitNavigatorComponent);
        component = fixture.componentInstance;
        component.pageIndex = INITIAL_PAGE_INDEX;
        component.limit = INITIAL_LIMIT;
        component.total = INITIAL_TOTAL;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change page backward", () => {
        const pageChangeSpy = spyOn(component.pageChange, "emit");
        emitClickOnElementByDataTestId(fixture, "backward-link");
        expect(pageChangeSpy).toHaveBeenCalledWith(INITIAL_PAGE_INDEX - 1);
    });

    it("should change page forward", () => {
        const pageChangeSpy = spyOn(component.pageChange, "emit");
        component.ngOnChanges();
        emitClickOnElementByDataTestId(fixture, "forward-link");
        expect(pageChangeSpy).toHaveBeenCalledWith(INITIAL_PAGE_INDEX + 1);
    });
});
