/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetVocabEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-vocab-event/set-vocab-event.component";
import { mockSetVocab } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

import { SharedTestModule } from "@common/modules/shared-test.module";

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
