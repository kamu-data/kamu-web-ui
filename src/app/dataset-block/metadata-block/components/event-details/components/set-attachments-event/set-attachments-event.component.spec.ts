/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockSetAttachments } from "../../mock.events";
import { SecurityContext } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetAttachmentsEventComponent } from "./set-attachments-event.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MarkdownModule } from "ngx-markdown";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("SetAttachmentsEventComponent", () => {
    let component: SetAttachmentsEventComponent;
    let fixture: ComponentFixture<SetAttachmentsEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SharedTestModule,
                NgbTooltipModule,
                HttpClientTestingModule,
                MarkdownModule.forRoot({
                    loader: HttpClient,
                    sanitize: SecurityContext.NONE,
                }),
                SetAttachmentsEventComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
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
