/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { EventTimeSource } from "@api/kamu.graphql.interface";

import { EventTimePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/event-time-property/event-time-property.component";

describe("EventTimePropertyComponent", () => {
    let component: EventTimePropertyComponent;
    let fixture: ComponentFixture<EventTimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EventTimePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EventTimePropertyComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput("data", { __typename: "EventTimeSourceFromMetadata" } satisfies EventTimeSource);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
