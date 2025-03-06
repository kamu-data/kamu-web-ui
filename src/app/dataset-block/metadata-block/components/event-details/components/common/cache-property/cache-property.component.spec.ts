/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CachePropertyComponent } from "./cache-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("CachePropertyComponent", () => {
    let component: CachePropertyComponent;
    let fixture: ComponentFixture<CachePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CachePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CachePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
