/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PDFDocumentProxy } from "ng2-pdf-viewer";

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

    it("should check to click 'Next button'", () => {
        component.totalPages = 5;
        expect(component.page).toEqual(1);
        component.nextPage();
        expect(component.page).toEqual(2);
    });

    it("should check to click 'Previous button'", () => {
        component.page = 3;
        component.prevPage();
        expect(component.page).toEqual(2);
    });

    it("should check to click 'Zoom In' button", () => {
        expect(component.zoom).toEqual(1);
        component.zoomIn();
        expect(component.zoom).toEqual(1.1);
    });

    it("should check to click 'Zoom Out' button", () => {
        expect(component.zoom).toEqual(1);
        component.zoomOut();
        expect(component.zoom).toEqual(0.9);
        const mockPdfDocument = {
            numPages: 10,

            destroy: () => Promise.resolve(),
        } as PDFDocumentProxy;
        component.afterLoadComplete(mockPdfDocument);
    });

    it("should check #afterLoadComplete", () => {
        const mockPdfDocument = {
            numPages: 10,
        } as PDFDocumentProxy;
        component.afterLoadComplete(mockPdfDocument);
        expect(component.totalPages).toEqual(10);
    });
});
