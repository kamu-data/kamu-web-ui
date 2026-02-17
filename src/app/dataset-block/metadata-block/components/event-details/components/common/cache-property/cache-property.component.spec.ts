/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CachePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cache-property/cache-property.component";

import { SharedTestModule } from "@common/modules/shared-test.module";

describe("CachePropertyComponent", () => {
    let component: CachePropertyComponent;
    let fixture: ComponentFixture<CachePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, CachePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CachePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
