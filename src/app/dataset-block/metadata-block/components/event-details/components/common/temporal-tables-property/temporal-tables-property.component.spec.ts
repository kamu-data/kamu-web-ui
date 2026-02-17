/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { TemporalTablesPropertyComponent } from "./temporal-tables-property.component";

describe("TemporalTablesPropertyComponent", () => {
    let component: TemporalTablesPropertyComponent;
    let fixture: ComponentFixture<TemporalTablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, TemporalTablesPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TemporalTablesPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
