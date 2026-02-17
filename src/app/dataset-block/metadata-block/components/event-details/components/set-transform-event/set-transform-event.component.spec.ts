/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ApolloTestingModule } from "apollo-angular/testing";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { SetTransformEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-transform-event/set-transform-event.component";
import { mockSetTransform } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("SetTransformEventComponent", () => {
    let component: SetTransformEventComponent;
    let fixture: ComponentFixture<SetTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [HIGHLIGHT_OPTIONS_PROVIDER],
            imports: [ApolloTestingModule, SharedTestModule, SetTransformEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SetTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
