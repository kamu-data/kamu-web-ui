/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { PercentPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { PDFDocumentProxy, PdfViewerModule } from "ng2-pdf-viewer";

import { MaybeUndefined } from "@interface/app.types";

@Component({
    selector: "app-pdf-viewer-content",
    imports: [
        //-----//
        PercentPipe,
        //-----//
        PdfViewerModule,
    ],
    templateUrl: "./pdf-viewer-content.component.html",
    styleUrl: "./pdf-viewer-content.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerContentComponent {
    @Input({ required: true }) public safePdfUrl: MaybeUndefined<string>;
    public page: number = 1;
    public totalPages: number = 0;
    public zoom: number = 1.0;
    public isLoadedPdfFile: boolean = false;

    public nextPage() {
        if (this.page < this.totalPages) this.page++;
    }

    public prevPage() {
        if (this.page > 1) this.page--;
    }

    public zoomIn() {
        this.zoom += 0.1;
    }

    public zoomOut() {
        if (this.zoom > 0.5) this.zoom -= 0.1;
    }

    public afterLoadComplete(pdfData: PDFDocumentProxy) {
        this.totalPages = pdfData.numPages;
        this.isLoadedPdfFile = true;
    }
}
