/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaginationComponent } from "./pagination.component";
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
        component.currentPage = 1;
        component.pageInfo = mockPageBasedInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit changed page number", () => {
        const pageNumber = 2;
        const pageChangeEventSpy = spyOn(component.pageChangeEvent, "emit");

        component.onPageChange(2);

        expect(pageChangeEventSpy).toHaveBeenCalledOnceWith(pageNumber);
    });
});
