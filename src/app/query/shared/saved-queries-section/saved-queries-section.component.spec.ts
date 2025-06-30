/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SavedQueriesSectionComponent } from "./saved-queries-section.component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { MatIconModule } from "@angular/material/icon";

describe("SavedQueriesSectionComponent", () => {
    let component: SavedQueriesSectionComponent;
    let fixture: ComponentFixture<SavedQueriesSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [CdkAccordionModule, MatIconModule, SavedQueriesSectionComponent],
});
        fixture = TestBed.createComponent(SavedQueriesSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
