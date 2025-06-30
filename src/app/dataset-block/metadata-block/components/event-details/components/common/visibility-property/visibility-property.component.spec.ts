/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VisibilityPropertyComponent } from "./visibility-property.component";
import { mockPublicDatasetVisibility } from "src/app/search/mock.data";

describe("VisibilityPropertyComponent", () => {
    let component: VisibilityPropertyComponent;
    let fixture: ComponentFixture<VisibilityPropertyComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [SharedTestModule, VisibilityPropertyComponent],
});
        fixture = TestBed.createComponent(VisibilityPropertyComponent);
        component = fixture.componentInstance;
        component.data = mockPublicDatasetVisibility;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
