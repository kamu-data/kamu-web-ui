/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecentActivityFiltersViewComponent } from "./recent-activity-filters-view.component";

describe("RecentActivityFiltersViewComponent", () => {
    let component: RecentActivityFiltersViewComponent;
    let fixture: ComponentFixture<RecentActivityFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RecentActivityFiltersViewComponent],
        });
        fixture = TestBed.createComponent(RecentActivityFiltersViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
