/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { EventTimePropertyComponent } from "./event-time-property.component";

describe("EventTimePropertyComponent", () => {
    let component: EventTimePropertyComponent;
    let fixture: ComponentFixture<EventTimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EventTimePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EventTimePropertyComponent);
        component = fixture.componentInstance;
        component.data = { __typename: "EventTimeSourceFromMetadata" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
