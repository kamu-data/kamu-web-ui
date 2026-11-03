/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";

import { mockPageBasedInfo } from "src/app/search/mock.data";

describe("PaginationComponent", () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaginationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "currentPage", 1);
        setComponentInput(fixture, "pageInfo", mockPageBasedInfo);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit changed page number", () => {
        const pageNumber = 2;
        const pageChangeEventSpy = vi.spyOn(component.pageChangeEvent, "emit").mockImplementation(() => {});

        component.onPageChange(2);

        expect(pageChangeEventSpy).toHaveBeenCalledTimes(1);

        expect(pageChangeEventSpy).toHaveBeenCalledWith(pageNumber);
    });

    it("should emit a page again after the parent moved to another page", () => {
        const pageChangeEventSpy = stubMethod(component.pageChangeEvent, "emit");
        component.onPageChange(3);
        setComponentInput(fixture, "currentPage", 3);

        // A new filter takes the list back to page 1
        setComponentInput(fixture, "currentPage", 1);
        fixture.detectChanges();
        component.onPageChange(3);

        expect(pageChangeEventSpy).toHaveBeenCalledTimes(2);
        expect(pageChangeEventSpy).toHaveBeenLastCalledWith(3);
    });

    it("should not emit the page the parent already shows", () => {
        const pageChangeEventSpy = stubMethod(component.pageChangeEvent, "emit");
        setComponentInput(fixture, "currentPage", 2);
        fixture.detectChanges();

        component.onPageChange(2);

        expect(pageChangeEventSpy).not.toHaveBeenCalled();
    });
});
