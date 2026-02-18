/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { EnginePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/engine-property/engine-property.component";

describe("EnginePropertyComponent", () => {
    let component: EnginePropertyComponent;
    let fixture: ComponentFixture<EnginePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EnginePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EnginePropertyComponent);
        component = fixture.componentInstance;
        component.data = "spark";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
