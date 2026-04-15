/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    JsonPipe,
    NgComponentOutlet,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
} from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    Type,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { saveAs } from "file-saver";
import { MarkdownModule } from "ngx-markdown";
import { ToastrService } from "ngx-toastr";

import { b64toBlob, getFileIconHelper } from "@common/helpers/data.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { PdfViewerContentComponent } from "./components/pdf-viewer/pdf-viewer-content.component";
import { PreviewFileTypePipe } from "./pipes/preview-file-type.pipe";

@Component({
    selector: "app-versioned-file-view",
    imports: [
        NgIf,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgComponentOutlet,
        JsonPipe,
        //-----//
        MatButtonModule,
        MatIconModule,
        MarkdownModule,
        MatProgressBarModule,
        NgbAlert,
        //-----//
        PreviewFileTypePipe,
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

    public urlContentPath: SafeUrl;
    public contentText: string | undefined;

    pdfComponent: Type<PdfViewerContentComponent> | null = null;

    public fileLatestVersion: number;

    private sanitizer = inject(DomSanitizer);
    private toastrService = inject(ToastrService);
    private cdr = inject(ChangeDetectorRef);
    private previewFileTypePipe = new PreviewFileTypePipe();

    @Input({ required: true })
    public set fileInfo(value: MaybeNull<VersionedFileView>) {
        this._fileDetails = value;
        this.setPreviewFileStrategy(this._fileDetails);
    }

    private async setPreviewFileStrategy(details: MaybeNull<VersionedFileView>): Promise<void> {
        if (details && details?.fileInfo) {
            this.fileLatestVersion = details?.fileInfo.version;
            const content = details?.fileInfo?.content;
            const contentUrl = details?.fileInfo?.contentUrl;
            const contentType = details.fileInfo.contentType;
            const cleanBase64 = content.replace(/-/g, "+").replace(/_/g, "/");

            switch (this.previewFileTypePipe.transform(contentType)) {
                case "text": {
                    try {
                        this.contentText = atob(content);
                    } catch {
                        this.contentText = content;
                    }
                    break;
                }

                case "pdf": {
                    this.urlContentPath = contentUrl.url;
                    const { PdfViewerContentComponent } =
                        await import("./components/pdf-viewer/pdf-viewer-content.component");
                    this.pdfComponent = PdfViewerContentComponent;
                    this.cdr.detectChanges();
                    break;
                }

                case "image":
                    this.urlContentPath = this.sanitizer.bypassSecurityTrustUrl(contentUrl.url);
                    break;

                case "json": {
                    try {
                        const jsonString = atob(cleanBase64);
                        this.contentText = JSON.parse(jsonString) as string;
                    } catch {
                        this.contentText = atob(cleanBase64);
                    }
                    break;
                }

                case "video":
                    break;

                default:
                    this.toastrService.info(`Content type not supported: ${contentType}`);
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
        return getFileIconHelper(contentType);
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
