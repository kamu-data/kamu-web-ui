/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/order-property/order-property.component";

import { SharedTestModule } from "@common/modules/shared-test.module";

describe("OrderPropertyComponent", () => {
    let component: OrderPropertyComponent;
    let fixture: ComponentFixture<OrderPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, OrderPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderPropertyComponent);
        component = fixture.componentInstance;
        component.data = "BY_NAME";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
