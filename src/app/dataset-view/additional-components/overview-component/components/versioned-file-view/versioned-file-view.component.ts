/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, JsonPipe, NgComponentOutlet } from "@angular/common";
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
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { BaseComponent } from "@common/components/base.component";
import { ValueNotFoundComponent } from "@common/components/value-not-found/value-not-found.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { PdfViewerContentComponent } from "./components/pdf-viewer/pdf-viewer-content.component";
import { PreviewFileTypePipe } from "./pipes/preview-file-type.pipe";

@Component({
    selector: "app-versioned-file-view",
    imports: [
        //-----//
        AsyncPipe,
        NgComponentOutlet,
        JsonPipe,
        //-----//
        MatIconModule,
        MatProgressBarModule,
        NgbAlert,
        //-----//
        ValueNotFoundComponent,
        PreviewFileTypePipe,
    ],
    templateUrl: "./versioned-file-view.component.html",
    styleUrl: "./versioned-file-view.component.scss",
    providers: [PreviewFileTypePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionedFileViewComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public version: number;

    public datasetBasics$ = new ReplaySubject<DatasetBasicsFragment>(1);
    public version$ = new BehaviorSubject<MaybeNull<number>>(null);

    public fileInfo$: Observable<VersionedFileView>;
    public loadingFileDetails$: Observable<boolean>;
    public contentText$: Observable<MaybeUndefined<object | string>>;

    public urlContentPath: SafeUrl;
    public pdfComponent: MaybeNull<Type<PdfViewerContentComponent>> = null;
    public fileLatestVersion: number;

    private isRedirectToLatestVersion = false;

    private sanitizer = inject(DomSanitizer);
    private toastrService = inject(ToastrService);
    private cdr = inject(ChangeDetectorRef);
    private iconRegistry = inject(MatIconRegistry);
    private navigationService = inject(NavigationService);
    private previewFileTypePipe = inject(PreviewFileTypePipe);
    private datasetAsVersionedFileService = inject(DatasetAsVersionedFileService);

    public ngOnInit(): void {
        this.loadingFileDetails$ = this.datasetAsVersionedFileService.loadingFileDetailsChanges;

        this.fileInfo$ = combineLatest([this.datasetBasics$, this.version$]).pipe(
            switchMap(([dataset, version]) => {
                const datasetId = dataset.id;
                if (this.isRedirectToLatestVersion || !version) {
                    this.isRedirectToLatestVersion = false;
                    return this.datasetAsVersionedFileService.requestDatasetAsVersionedFile(datasetId);
                }
                return this.datasetAsVersionedFileService.requestDatasetAsVersionedFileByVersion(datasetId, version);
            }),
            tap((data) => promiseWithCatch(this.setPreviewFileStrategy(data))),
        );
    }

    public ngOnChanges(changes: SimpleChanges<VersionedFileViewComponent>): void {
        if (changes.datasetBasics) {
            this.datasetBasics$.next(changes.datasetBasics.currentValue);
        }
        if (changes.version && changes.version.previousValue !== changes.version.currentValue) {
            this.version$.next(changes.version.currentValue);
        }
    }

    public async setPreviewFileStrategy(details: MaybeNull<VersionedFileView>): Promise<void> {
        if (!details?.fileInfo) return;

        const { version, contentUrl, contentType } = details.fileInfo;
        this.fileLatestVersion = version;

        const fileType = this.previewFileTypePipe.transform(contentType);

        switch (fileType) {
            case "text":
                this.contentText$ = this.datasetAsVersionedFileService.requestFileAsText(contentUrl.url);
                break;

            case "json":
                this.contentText$ = this.datasetAsVersionedFileService.requestFileAsJson(contentUrl.url);
                break;

            case "pdf":
                this.urlContentPath = contentUrl.url;
                const { PdfViewerContentComponent } =
                    await import("./components/pdf-viewer/pdf-viewer-content.component");
                this.pdfComponent = PdfViewerContentComponent;
                this.cdr.detectChanges();
                break;

            case "svg":
                this.iconRegistry.addSvgIcon(
                    "custom-svg",
                    this.sanitizer.bypassSecurityTrustResourceUrl(contentUrl.url),
                );
                break;

            case "video":
            case "audio":
            case "image":
                this.urlContentPath = this.sanitizer.bypassSecurityTrustUrl(contentUrl.url);
                break;

            default:
                this.toastrService.info(`Content type not supported: ${contentType}`);
        }
    }

    public goToLatestVersionedFile(): void {
        this.isRedirectToLatestVersion = true;
        this.version$.next(this.version);

        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    /** Whether the URL asks for a version the file does not have */
    public isMissingVersion(fileDetails: VersionedFileView): boolean {
        return this.version > 0 && !fileDetails.fileInfo;
    }

    public isLatestVersion(fileDetails: VersionedFileView): boolean {
        return !fileDetails?.fileInfo || fileDetails.fileInfo.version === fileDetails.countVersions;
    }

    public downloadFile(fileDetails: VersionedFileView): void {
        this.datasetAsVersionedFileService.downloadFile(this.datasetBasics.id, fileDetails);
    }
}
