/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetTransform } from "../../mock.events";
import { SetTransformEventComponent } from "./set-transform-event.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "src/app/common/helpers/app.helpers";

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
