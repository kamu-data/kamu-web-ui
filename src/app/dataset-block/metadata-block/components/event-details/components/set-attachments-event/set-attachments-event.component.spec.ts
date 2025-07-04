/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockSetAttachments } from "../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetAttachmentsEventComponent } from "./set-attachments-event.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { MarkdownModule } from "ngx-markdown";

describe("SetAttachmentsEventComponent", () => {
    let component: SetAttachmentsEventComponent;
    let fixture: ComponentFixture<SetAttachmentsEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, MarkdownModule.forRoot(), SetAttachmentsEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SetAttachmentsEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetAttachments;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
