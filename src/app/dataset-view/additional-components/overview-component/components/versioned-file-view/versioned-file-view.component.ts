/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { JsonPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { saveAs } from "file-saver";
import { MarkdownModule } from "ngx-markdown";

import { b64toBlob } from "@common/helpers/data.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { PdfViewerContentComponent } from "./components/pdf-viewer/pdf-viewer-content.component";

@Component({
    selector: "app-versioned-file-view",
    imports: [
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgTemplateOutlet,
        JsonPipe,
        //-----//
        MatButtonModule,
        MatIconModule,
        MarkdownModule,
        MatProgressBarModule,
        NgbAlert,
        //-----//
        PdfViewerContentComponent,
    ],
    templateUrl: "./versioned-file-view.component.html",
    styleUrl: "./versioned-file-view.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionedFileViewComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public loadingFile: boolean;
    @Output() public goToLatestVersionedFileEmitter = new EventEmitter<void>();
    private _fileDetails: MaybeNull<VersionedFileView>;
    public safePdfUrl: string | undefined;
    public imagePath: SafeUrl;
    public videoPath: SafeUrl;
    public jsonPath: SafeUrl;
    public plainText: string = "";

    public fileLatestVersion: number;

    private sanitizer = inject(DomSanitizer);

    @Input({ required: true })
    public set fileInfo(value: MaybeNull<VersionedFileView>) {
        this._fileDetails = value;
        this.setPreviewFileStrategy(this._fileDetails);
    }

    private setPreviewFileStrategy(details: MaybeNull<VersionedFileView>): void {
        if (details && details?.fileInfo) {
            this.fileLatestVersion = details?.fileInfo.version;
            const content = details?.fileInfo?.content;
            const contentUrl = details?.fileInfo?.contentUrl;
            const contentType = details.fileInfo.contentType;
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

    public goToLatestVersionedFile(): void {
        this.goToLatestVersionedFileEmitter.emit();
    }

    public get fileDetails(): MaybeNull<VersionedFileView> {
        return this._fileDetails;
    }

    public get isLatestVersion(): boolean {
        const noFileInfo = !this.fileDetails?.fileInfo;
        return noFileInfo || this.fileDetails?.fileInfo?.version === this.fileDetails?.countVersions;
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
