/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    JsonPipe,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
    PercentPipe,
} from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { saveAs } from "file-saver";
import { PDFDocumentProxy, PdfViewerModule } from "ng2-pdf-viewer";
import { MarkdownModule } from "ngx-markdown";

import { b64toBlob } from "@common/helpers/data.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-versioned-file-view",
    imports: [
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgTemplateOutlet,
        PercentPipe,
        JsonPipe,
        //-----//
        MatButtonModule,
        MatIconModule,
        MarkdownModule,
        MatProgressBarModule,
        //-----//
        PdfViewerModule,
    ],
    templateUrl: "./versioned-file-view.component.html",
    styleUrl: "./versioned-file-view.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionedFileViewComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public loadingFile: boolean;
    private _fileDetails: MaybeNull<VersionedFileView>;
    public safePdfUrl: string | undefined;

    public imagePath: SafeUrl;
    public videoPath: SafeUrl;
    public jsonPath: SafeUrl;
    public plainText: string = "";

    public page: number = 1;
    public totalPages: number = 0;
    public zoom: number = 1.0;
    public isLoadedPdfFile: boolean = false;
    public fileLatestVersion: number;

    private sanitizer = inject(DomSanitizer);

    @Input({ required: true })
    public set fileInfo(value: MaybeNull<VersionedFileView>) {
        this._fileDetails = value;
        if (value && value?.fileInfo) {
            this.fileLatestVersion = value?.fileInfo.version;
            const content = value?.fileInfo?.content;
            const contentUrl = value?.fileInfo?.contentUrl;
            const contentType = value.fileInfo.contentType;
            const cleanBase64 = content.replace(/-/g, "+").replace(/_/g, "/");

            switch (contentType) {
                case "text/plain": {
                    try {
                        this.plainText = atob(content);
                    } catch {
                        throw new Error(`Base64 decoding error`);
                    }
                    break;
                }

                case "application/pdf": {
                    this.safePdfUrl = contentUrl.url;
                    this.page = 1;

                    break;
                }

                case "image/jpeg":
                case "image/webp":
                case "image/jpg":
                case "image/png":
                    this.imagePath = this.sanitizer.bypassSecurityTrustUrl(contentUrl.url);
                    break;

                case "video/mp4":
                case "video/quicktime": {
                    this.videoPath = this.sanitizer.bypassSecurityTrustUrl(contentUrl.url);
                    break;
                }

                case "application/json":
                case "application/vnd.desci.collaborative+json": {
                    try {
                        const jsonString = atob(cleanBase64);
                        this.plainText = JSON.parse(jsonString) as string;
                    } catch {
                        throw new Error(`File parsing error`);
                    }
                    break;
                }

                default:
                    throw new Error(`Content type not supported:${contentType} `);
            }
        }
    }

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

    public get fileDetails(): MaybeNull<VersionedFileView> {
        return this._fileDetails;
    }

    public getFileIcon(contentType: string): string {
        if (!contentType) return "insert_drive_file";

        if (contentType.startsWith("image/")) return "image";
        if (contentType.startsWith("video/")) return "movie";
        if (contentType.startsWith("audio/")) return "audiotrack";

        switch (contentType) {
            case "application/pdf":
                return "picture_as_pdf";
            case "text/plain":
                return "description";
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return "article";
            default:
                return "insert_drive_file";
        }
    }

    public downloadFile() {
        if (this.fileDetails?.fileInfo?.contentUrl.url) {
            const content = this.fileDetails?.fileInfo?.content;

            const contentType = this.fileDetails?.fileInfo?.contentType;
            const cleanBase64 = content.replace(/-/g, "+").replace(/_/g, "/");
            const blob = b64toBlob(cleanBase64, contentType);

            saveAs(blob, this.fileDetails.name);
        }
    }
}
