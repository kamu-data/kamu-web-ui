/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, JsonPipe, NgComponentOutlet, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    Type,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { Observable, tap } from "rxjs";

import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { MarkdownModule } from "ngx-markdown";
import { ToastrService } from "ngx-toastr";

import { BaseComponent } from "@common/components/base.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { PdfViewerContentComponent } from "./components/pdf-viewer/pdf-viewer-content.component";
import { PreviewFileTypePipe } from "./pipes/preview-file-type.pipe";

@Component({
    selector: "app-versioned-file-view",
    imports: [
        AsyncPipe,
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
export class VersionedFileViewComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public fileInfo$: Observable<VersionedFileView>;
    public loadingFileDetails$: Observable<boolean>;

    public urlContentPath: SafeUrl;
    public contentText$: Observable<undefined | object | string>;

    public pdfComponent: Type<PdfViewerContentComponent> | null = null;

    public fileLatestVersion: number;

    private sanitizer = inject(DomSanitizer);
    private toastrService = inject(ToastrService);
    private cdr = inject(ChangeDetectorRef);

    private previewFileTypePipe = new PreviewFileTypePipe();
    private datasetAsVersionedFileService = inject(DatasetAsVersionedFileService);

    public ngOnInit(): void {
        this.loadingFileDetails$ = this.datasetAsVersionedFileService.loadingFileDetailsChanges;
        this.datasetAsVersionedFileService.selectFileVersionChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((version) => {
                this.fileInfo$ = this.datasetAsVersionedFileService.requestDatasetAsVersionedFileByVersion(
                    this.datasetBasics.id,
                    version,
                );
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.datasetBasics && changes.datasetBasics.currentValue !== changes.datasetBasics.previousValue) {
            this.loadDatasetAsVersionedFile();
        }
    }

    private loadDatasetAsVersionedFile(): void {
        this.fileInfo$ = this.datasetAsVersionedFileService
            .requestDatasetAsVersionedFile(this.datasetBasics.id)
            .pipe(tap((data) => promiseWithCatch(this.setPreviewFileStrategy(data))));
    }

    public async setPreviewFileStrategy(details: MaybeNull<VersionedFileView>): Promise<void> {
        if (details && details?.fileInfo) {
            this.fileLatestVersion = details?.fileInfo.version;

            const contentUrl = details?.fileInfo?.contentUrl;
            const contentType = details.fileInfo.contentType;

            switch (this.previewFileTypePipe.transform(contentType)) {
                case "text": {
                    this.contentText$ = this.datasetAsVersionedFileService.requestFileAsText(contentUrl.url);
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

                case "video":
                case "audio":
                case "image":
                    this.urlContentPath = this.sanitizer.bypassSecurityTrustUrl(contentUrl.url);
                    break;

                case "json": {
                    this.contentText$ = this.datasetAsVersionedFileService.requestFileAsJson(contentUrl.url);
                    break;
                }

                default:
                    this.toastrService.info(`Content type not supported: ${contentType}`);
            }
        }
    }

    public goToLatestVersionedFile(): void {
        this.loadDatasetAsVersionedFile();
    }

    public isLatestVersion(fileDetails: VersionedFileView): boolean {
        const noFileInfo = !fileDetails?.fileInfo;
        return noFileInfo || fileDetails?.fileInfo?.version === fileDetails?.countVersions;
    }

    public downloadFile(fileDetails: VersionedFileView) {
        this.datasetAsVersionedFileService.downloadFile(this.datasetBasics.id, fileDetails);
    }
}
