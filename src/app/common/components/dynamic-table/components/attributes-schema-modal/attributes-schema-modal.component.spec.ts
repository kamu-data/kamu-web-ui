/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MarkdownModule } from "ngx-markdown";
import { OdfTypes } from "src/app/interface/dataset-schema.interface";

import { AttributesSchemaModalComponent } from "./attributes-schema-modal.component";

describe("AttributesSchemaModalComponent", () => {
    let component: AttributesSchemaModalComponent;
    let fixture: ComponentFixture<AttributesSchemaModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AttributesSchemaModalComponent, MarkdownModule.forRoot()],
        });
        fixture = TestBed.createComponent(AttributesSchemaModalComponent);
        component = fixture.componentInstance;
        ((component.element = {
            name: "offset",
            type: {
                kind: OdfTypes.String,
            },
        }),
            fixture.detectChanges());
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
