/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SourceEventCommonDataComponent } from "./source-event-common-data.component";

describe("SourceEventCommonDataComponent", () => {
    let component: SourceEventCommonDataComponent;
    let fixture: ComponentFixture<SourceEventCommonDataComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SourceEventCommonDataComponent],
        });
        fixture = TestBed.createComponent(SourceEventCommonDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
