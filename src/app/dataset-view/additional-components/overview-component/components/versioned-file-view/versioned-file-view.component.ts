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
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { PdfViewerModule } from "ng2-pdf-viewer";
import { MarkdownModule } from "ngx-markdown";

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
    set fileInfo(value: MaybeNull<VersionedFileView>) {
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
                    } catch (e) {
                        throw new Error(`Base64 decoding error:${e}`);
                    }
                    break;
                }

                case "application/pdf": {
                    try {
                        this.safePdfUrl = contentUrl.url;
                        this.page = 1;
                    } catch (e) {
                        this.safePdfUrl = undefined;
                    }
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
                        this.plainText = JSON.parse(jsonString);
                    } catch (e) {
                        throw new Error(`File parsing error:${e}`);
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

    public afterLoadComplete(pdfData: any) {
        this.totalPages = pdfData.numPages;
        this.isLoadedPdfFile = true;
    }

    public get fileDetails(): MaybeNull<VersionedFileView> {
        return this._fileDetails;
    }
}
