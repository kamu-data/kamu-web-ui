/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PdfViewerContentComponent } from "./pdf-viewer-content.component";

describe("PdfViewerComponent", () => {
    let component: PdfViewerContentComponent;
    let fixture: ComponentFixture<PdfViewerContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PdfViewerContentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PdfViewerContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
