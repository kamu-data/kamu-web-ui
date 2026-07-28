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
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { BehaviorSubject, combineLatest, from, Observable, of, take } from "rxjs";
import { catchError, distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";

import { NgbAlert, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MarkdownModule } from "ngx-markdown";
import { ToastrService } from "ngx-toastr";

import { BaseComponent } from "@common/components/base.component";
import { DragAndDropDirective } from "@common/directives/drag-and-drop.directive";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { FileInformationModalComponent } from "./components/file-information-modal/file-information-modal.component";
import { PdfViewerContentComponent } from "./components/pdf-viewer/pdf-viewer-content.component";
import { PreviewFileTypePipe } from "./pipes/preview-file-type.pipe";
import { FileInformationData } from "./versioned-file-view.model";

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
        DragAndDropDirective,
    ],
    templateUrl: "./versioned-file-view.component.html",
    styleUrl: "./versioned-file-view.component.scss",
    providers: [PreviewFileTypePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionedFileViewComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public version: number;

    public datasetBasics$ = new BehaviorSubject<MaybeNull<DatasetBasicsFragment>>(null);
    public version$ = new BehaviorSubject<MaybeNull<number>>(null);

    public fileInfo$: Observable<VersionedFileView>;
    public loadingFileDetails$: Observable<boolean>;
    public contentText$: Observable<undefined | object | string> = of(undefined);

    public urlContentPath: SafeUrl | undefined;
    public svgIconName: string | undefined;
    public pdfComponent: Type<PdfViewerContentComponent> | null = null;
    public fileLatestVersion: number;

    private previewVersion: number | null = null;

    private sanitizer = inject(DomSanitizer);
    private toastrService = inject(ToastrService);
    private cdr = inject(ChangeDetectorRef);
    private iconRegistry = inject(MatIconRegistry);
    private navigationService = inject(NavigationService);
    private previewFileTypePipe = inject(PreviewFileTypePipe);
    private datasetAsVersionedFileService = inject(DatasetAsVersionedFileService);
    private ngbModalService = inject(NgbModal);

    public ngOnInit(): void {
        this.loadingFileDetails$ = this.datasetAsVersionedFileService.loadingFileDetailsChanges;

        this.fileInfo$ = combineLatest([this.datasetBasics$, this.version$]).pipe(
            map(([dataset, version]) => ({
                datasetId: dataset?.id as string,
                version,
            })),
            distinctUntilChanged(
                (previous, current) => previous.datasetId === current.datasetId && previous.version === current.version,
            ),
            switchMap(({ datasetId, version }) => {
                if (!version) {
                    return this.datasetAsVersionedFileService.requestDatasetAsVersionedFile(datasetId);
                }
                return this.datasetAsVersionedFileService.requestDatasetAsVersionedFileByVersion(datasetId, version);
            }),
            switchMap((data) => from(this.setPreviewFileStrategy(data)).pipe(map(() => data))),
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.datasetBasics) {
            this.datasetBasics$.next(changes.datasetBasics.currentValue as DatasetBasicsFragment);
        }
        if (changes.version && changes.version.previousValue !== changes.version.currentValue) {
            this.version$.next(changes.version.currentValue as number);
        }
    }

    public async setPreviewFileStrategy(details: MaybeNull<VersionedFileView>): Promise<void> {
        this.previewVersion = details?.fileInfo?.version ?? null;
        this.resetPreview();

        if (!details?.fileInfo) {
            this.cdr.markForCheck();
            return;
        }

        const { version, contentUrl, contentType, contentHash } = details.fileInfo;
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

                if (this.previewVersion !== version) return;

                this.pdfComponent = PdfViewerContentComponent;
                break;

            case "svg":
                this.svgIconName = `custom-svg-${contentHash}`;
                this.iconRegistry.addSvgIcon(
                    this.svgIconName,
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

        this.cdr.markForCheck();
    }

    private resetPreview(): void {
        this.contentText$ = of(undefined);
        this.urlContentPath = undefined;
        this.svgIconName = undefined;
        this.pdfComponent = null;
    }

    public goToLatestVersionedFile(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    public isLatestVersion(fileDetails: VersionedFileView): boolean {
        return !fileDetails?.fileInfo || fileDetails.fileInfo.version === fileDetails.countVersions;
    }

    public downloadFile(fileDetails: VersionedFileView): void {
        this.datasetAsVersionedFileService.downloadFile(this.datasetBasics.id, fileDetails);
    }

    public onRollbackFile(version: number): void {
        this.datasetAsVersionedFileService.rollBackVersionedFile(this.datasetBasics, version);
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            const file: File = input.files[0];
            this.onUploaduploadVersionedFile(file);
        }
    }

    public onFileDropped(files: FileList): void {
        const droppedFile = files[0];
        this.onUploaduploadVersionedFile(droppedFile);
    }

    private onUploaduploadVersionedFile(file: File): void {
        const modalRef = this.ngbModalService.open(FileInformationModalComponent);
        const modalRefInstance = modalRef.componentInstance as FileInformationModalComponent;
        modalRefInstance.fileInformation = file;

        from(modalRef.result)
            .pipe(
                filter((data) => !!data),
                switchMap((result: FileInformationData) => {
                    const updatedFile = new File([file], file.name, {
                        type: result.contentType,
                        lastModified: file.lastModified,
                    });
                    return this.datasetAsVersionedFileService
                        .uploadVersionedFile(updatedFile, this.datasetBasics)
                        .pipe(takeUntilDestroyed(this.destroyRef));
                }),
                take(1),
                catchError(() => of(null)),
            )
            .subscribe();
    }
}
