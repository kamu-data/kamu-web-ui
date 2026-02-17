/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { mockSetInfo } from "../../mock.events";
import { SetInfoEventComponent } from "./set-info-event.component";

describe("SetInfoEventComponent", () => {
    let component: SetInfoEventComponent;
    let fixture: ComponentFixture<SetInfoEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SetInfoEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SetInfoEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
