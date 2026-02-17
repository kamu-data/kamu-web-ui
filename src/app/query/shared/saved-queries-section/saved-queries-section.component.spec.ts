/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SavedQueriesSectionComponent } from "./saved-queries-section.component";

describe("SavedQueriesSectionComponent", () => {
    let component: SavedQueriesSectionComponent;
    let fixture: ComponentFixture<SavedQueriesSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SavedQueriesSectionComponent],
        });
        fixture = TestBed.createComponent(SavedQueriesSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
