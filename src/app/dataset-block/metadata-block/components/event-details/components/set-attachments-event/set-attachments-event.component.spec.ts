/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideMarkdown } from "ngx-markdown";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { SetAttachmentsEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-attachments-event/set-attachments-event.component";
import { mockSetAttachments } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

describe("SetAttachmentsEventComponent", () => {
    let component: SetAttachmentsEventComponent;
    let fixture: ComponentFixture<SetAttachmentsEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SetAttachmentsEventComponent],
            providers: [provideMarkdown()],
        }).compileComponents();

        fixture = TestBed.createComponent(SetAttachmentsEventComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "event", mockSetAttachments);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
