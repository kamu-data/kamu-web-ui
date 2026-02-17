/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { mockSetVocab } from "../../mock.events";
import { SetVocabEventComponent } from "./set-vocab-event.component";

describe("SetVocabEventComponent", () => {
    let component: SetVocabEventComponent;
    let fixture: ComponentFixture<SetVocabEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SetVocabEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SetVocabEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetVocab;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
