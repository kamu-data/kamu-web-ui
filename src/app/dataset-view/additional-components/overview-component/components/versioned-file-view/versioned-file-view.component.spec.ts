/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of, tap } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { VersionedFileEntryDataFragment } from "@api/kamu.graphql.interface";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { mockDatasetAsVersionedFileQuery, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { VersionedFileViewComponent } from "./versioned-file-view.component";

describe("VersionedFileViewComponent", () => {
    let component: VersionedFileViewComponent;
    let fixture: ComponentFixture<VersionedFileViewComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;
    let toastrService: ToastrService;
    let navigationService: NavigationService;

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
        fixture = TestBed.createComponent(VersionedFileViewComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check ngOnInit", () => {
        component.version$.next(0);
        fixture.detectChanges();
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFile",
        ).and.returnValue(of(mockVersionedFileView).pipe(tap()));
        spyOn(component, "setPreviewFileStrategy").and.returnValue(Promise.resolve());

        component.ngOnInit();
        component.fileInfo$.subscribe(() => {
            expect(requestDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check ngOnInit with version", () => {
        component.version$.next(2);
        fixture.detectChanges();
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFile").and.returnValue(
            of(mockVersionedFileView).pipe(tap()),
        );
        const requestDatasetAsVersionedFileByVersionSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFileByVersion",
        ).and.returnValue(of(mockVersionedFileView).pipe(tap()));
        spyOn(component, "setPreviewFileStrategy").and.returnValue(Promise.resolve());

        component.ngOnInit();
        component.fileInfo$.subscribe(() => {
            expect(requestDatasetAsVersionedFileByVersionSpy).toHaveBeenCalledTimes(1);
        });
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
});
