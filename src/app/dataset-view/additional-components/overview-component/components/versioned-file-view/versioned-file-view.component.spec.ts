/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { VersionedFileEntryDataFragment } from "@api/kamu.graphql.interface";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { mockDatasetAsVersionedFileQuery, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { FileInformationModalComponent } from "./components/file-information-modal/file-information-modal.component";
import { VersionedFileViewComponent } from "./versioned-file-view.component";

describe("VersionedFileViewComponent", () => {
    let component: VersionedFileViewComponent;
    let fixture: ComponentFixture<VersionedFileViewComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;
    let toastrService: ToastrService;
    let navigationService: NavigationService;
    let ngbModalService: NgbModal;

    const MOCK_VERSIONED_VIEW_FILE: VersionedFileView = {
        name: mockDatasetAsVersionedFileQuery.datasets.byId?.name as string,
        fileInfo: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile
            ?.latest as VersionedFileEntryDataFragment,
        countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount as number,
    };

    function setMockObjectByContentType(contentType: string): VersionedFileView {
        return Object.assign({}, MOCK_VERSIONED_VIEW_FILE, {
            fileInfo: {
                ...(mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile
                    ?.latest as VersionedFileEntryDataFragment),
                contentType,
            },
        });
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VersionedFileViewComponent, SharedTestModule],
            providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi())],
        }).compileComponents();

        datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        navigationService = TestBed.inject(NavigationService);
        toastrService = TestBed.inject(ToastrService);
        ngbModalService = TestBed.inject(NgbModal);
        fixture = TestBed.createComponent(VersionedFileViewComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should request the latest file details on init when version is not set", async () => {
        component.datasetBasics$.next(mockDatasetBasicsRootFragment);
        component.version$.next(0);
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFile",
        ).and.returnValue(of(mockVersionedFileView));
        spyOn(component, "setPreviewFileStrategy").and.resolveTo();

        component.ngOnInit();
        await firstValueFrom(component.fileInfo$);

        expect(requestDatasetAsVersionedFileSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment.id);
    });

    it("should request file details for the selected version on init", async () => {
        component.datasetBasics$.next(mockDatasetBasicsRootFragment);
        component.version$.next(2);
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileByVersionSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFileByVersion",
        ).and.returnValue(of(mockVersionedFileView));
        spyOn(component, "setPreviewFileStrategy").and.resolveTo();

        component.ngOnInit();
        await firstValueFrom(component.fileInfo$);

        expect(requestDatasetAsVersionedFileByVersionSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment.id, 2);
    });

    it("should not request the same dataset version twice", () => {
        component.datasetBasics$.next(mockDatasetBasicsRootFragment);
        component.version$.next(2);
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileByVersionSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFileByVersion",
        ).and.returnValue(of(mockVersionedFileView));
        spyOn(component, "setPreviewFileStrategy").and.resolveTo();

        component.ngOnInit();
        const subscription = component.fileInfo$.subscribe();
        component.datasetBasics$.next({ ...mockDatasetBasicsRootFragment });

        expect(requestDatasetAsVersionedFileByVersionSpy).toHaveBeenCalledTimes(1);
        subscription.unsubscribe();
    });

    it("should check setPreviewFileStrategy method for pdf file", async () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("application/pdf");
        await component.setPreviewFileStrategy(mockVersionedFileView);

        expect(component.urlContentPath).toEqual(
            mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.latest?.contentUrl.url as string,
        );
    });

    it("should check setPreviewFileStrategy method for text file", async () => {
        const requestFileAsTextSpy = spyOn(datasetAsVersionedFileService, "requestFileAsText");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(requestFileAsTextSpy).toHaveBeenCalledTimes(1);
        }
    });

    it("should refresh text preview when file version changes", async () => {
        const requestFileAsTextSpy = spyOn(datasetAsVersionedFileService, "requestFileAsText").and.callFake(
            (url: string) => of(url),
        );
        const firstVersion: VersionedFileView = setMockObjectByContentType("text/plain");
        const secondVersionUrl = "https://example.com/version-3.txt";
        const secondVersion: VersionedFileView = {
            ...firstVersion,
            fileInfo: {
                ...(firstVersion.fileInfo as VersionedFileEntryDataFragment),
                version: 3,
                contentHash: "new-content-hash",
                contentUrl: {
                    url: secondVersionUrl,
                    expiresAt: "2026-04-20T17:06:49.060763118+00:00",
                },
            },
        };

        await component.setPreviewFileStrategy(firstVersion);
        await component.setPreviewFileStrategy(secondVersion);

        expect(requestFileAsTextSpy.calls.mostRecent().args[0]).toBe(secondVersionUrl);
        component.contentText$.subscribe((content) => {
            expect(content).toBe(secondVersionUrl);
        });
    });

    it("should clear the previous preview when file details are empty", async () => {
        component.urlContentPath = "https://example.com/old-file";
        component.svgIconName = "old-svg";
        component.pdfComponent = {} as unknown as typeof component.pdfComponent;

        await component.setPreviewFileStrategy(null);

        expect(component.urlContentPath).toBeUndefined();
        expect(component.svgIconName).toBeUndefined();
        expect(component.pdfComponent).toBeNull();
        component.contentText$.subscribe((content) => {
            expect(content).toBeUndefined();
        });
    });

    it("should register a unique icon for an SVG preview", async () => {
        const mockVersionedFileView = setMockObjectByContentType("image/svg+xml");
        const contentHash = mockVersionedFileView.fileInfo?.contentHash as string;

        await component.setPreviewFileStrategy(mockVersionedFileView);

        expect(component.svgIconName).toBe(`custom-svg-${contentHash}`);
    });

    it("should check setPreviewFileStrategy method for video file", async () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("video/mp4");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(component.urlContentPath).toBeDefined();
        }
    });

    it("should check setPreviewFileStrategy method for json file", async () => {
        const requestFileAsJsonSpy = spyOn(datasetAsVersionedFileService, "requestFileAsJson");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("application/json");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(requestFileAsJsonSpy).toHaveBeenCalledTimes(1);
        }
    });

    it("should check setPreviewFileStrategy method for unspported file", async () => {
        const toastrServiceInfoSpy = spyOn(toastrService, "info");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("unsupported/type");

        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(toastrServiceInfoSpy).toHaveBeenCalledWith("Content type not supported: unsupported/type");
        }
    });

    it("should check redirecr to latest version", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.returnValue();
        component.goToLatestVersionedFile();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                tab: DatasetViewTypeEnum.Overview,
            }),
        );
    });

    it("should check is latest version", () => {
        const result = component.isLatestVersion(MOCK_VERSIONED_VIEW_FILE);
        expect(result).toEqual(true);
    });

    it("should check dowmload file", () => {
        const downloadFileSpy = spyOn(datasetAsVersionedFileService, "downloadFile");
        component.downloadFile(MOCK_VERSIONED_VIEW_FILE);
        expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    });

    it("should roll back the selected version", () => {
        const rollBackVersionedFileSpy = spyOn(datasetAsVersionedFileService, "rollBackVersionedFile");

        component.onRollbackFile(3);

        expect(rollBackVersionedFileSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment, 3);
    });

    it("should upload a file selected through the file input with the MIME type from the modal", async () => {
        const file = new File(["content"], "file.txt", { type: "" });
        const modalRef = {
            componentInstance: {},
            result: Promise.resolve({
                name: file.name,
                contentLength: file.size,
                contentType: "text/plain",
            }),
        } as NgbModalRef;
        const openModalSpy = spyOn(ngbModalService, "open").and.returnValue(modalRef);
        const uploadVersionedFileSpy = spyOn(datasetAsVersionedFileService, "uploadVersionedFile").and.returnValue(
            of(3),
        );
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        component.onFileSelected({
            target: {
                files: [file] as unknown as FileList,
            },
        } as unknown as Event);
        await modalRef.result;

        expect(openModalSpy).toHaveBeenCalledOnceWith(FileInformationModalComponent);
        expect((modalRef.componentInstance as FileInformationModalComponent).fileInformation).toBe(file);
        expect(uploadVersionedFileSpy).toHaveBeenCalledTimes(1);
        const uploadedFile = uploadVersionedFileSpy.calls.mostRecent().args[0];
        expect(uploadedFile.name).toBe(file.name);
        expect(uploadedFile.type).toBe("text/plain");
        expect(uploadVersionedFileSpy.calls.mostRecent().args[1]).toBe(mockDatasetBasicsRootFragment);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
            version: "3",
        });
    });

    it("should upload a dropped file", async () => {
        const file = new File(["content"], "file.json", { type: "application/json" });
        const modalRef = {
            componentInstance: {},
            result: Promise.resolve({
                name: file.name,
                contentLength: file.size,
                contentType: file.type,
            }),
        } as NgbModalRef;
        spyOn(ngbModalService, "open").and.returnValue(modalRef);
        const uploadVersionedFileSpy = spyOn(datasetAsVersionedFileService, "uploadVersionedFile").and.returnValue(
            of(4),
        );
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        component.onFileDropped([file] as unknown as FileList);
        await modalRef.result;

        expect(uploadVersionedFileSpy).toHaveBeenCalledTimes(1);
        expect(uploadVersionedFileSpy.calls.mostRecent().args[0].type).toBe("application/json");
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
            version: "4",
        });
    });

    it("should not navigate when the file information modal is dismissed", async () => {
        const file = new File(["content"], "file.txt", { type: "text/plain" });
        const modalRef = {
            componentInstance: {},
            result: Promise.reject(new Error("Modal dismissed")),
        } as NgbModalRef;
        spyOn(ngbModalService, "open").and.returnValue(modalRef);
        const uploadVersionedFileSpy = spyOn(datasetAsVersionedFileService, "uploadVersionedFile");
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        component.onFileSelected({
            target: {
                files: [file] as unknown as FileList,
            },
        } as unknown as Event);
        await modalRef.result.catch(() => undefined);

        expect(uploadVersionedFileSpy).not.toHaveBeenCalled();
        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("should ignore a file input event without files", () => {
        const openModalSpy = spyOn(ngbModalService, "open");

        component.onFileSelected({
            target: {
                files: [] as unknown as FileList,
            },
        } as unknown as Event);

        expect(openModalSpy).not.toHaveBeenCalled();
    });
});
