/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { Mock } from "vitest";

import { ValueNotFoundHarness } from "@common/components/value-not-found/value-not-found.harness";
import { findElementByDataTestId, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { MaybeNull } from "@interface/app.types";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    MOCK_VERSIONED_FILE_NAME,
    mockDatasetAsVersionedFileQuery,
    mockDatasetBasicsRootFragment,
    mockVersionedFileEntryLatest,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { VersionedFileViewComponent } from "./versioned-file-view.component";
import { VersionedFileContentView } from "./versioned-file-view.model";
import { VersionedFileViewTexts } from "./versioned-file-view.text";

describe("VersionedFileViewComponent", () => {
    let component: VersionedFileViewComponent;
    let fixture: ComponentFixture<VersionedFileViewComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;
    let toastrService: ToastrService;
    let navigationService: NavigationService;

    const MOCK_VERSIONED_VIEW_FILE: VersionedFileView = {
        name: MOCK_VERSIONED_FILE_NAME,
        fileInfo: mockVersionedFileEntryLatest,
        countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
    };

    const MOCK_CONTENT_URL = "https://example.com/file-content";

    function setMockObjectByContentType(contentType: string): VersionedFileView {
        return Object.assign({}, MOCK_VERSIONED_VIEW_FILE, {
            fileInfo: {
                ...mockVersionedFileEntryLatest,
                contentType,
            },
        });
    }

    function contentViewOf(
        contentType: string,
        contentUrl: MaybeNull<string> = MOCK_CONTENT_URL,
    ): VersionedFileContentView {
        return { details: setMockObjectByContentType(contentType), contentUrl };
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VersionedFileViewComponent, SharedTestModule],
            providers: [Apollo, provideToastr(), provideHttpClient()],
        }).compileComponents();

        datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        navigationService = TestBed.inject(NavigationService);
        toastrService = TestBed.inject(ToastrService);
        fixture = TestBed.createComponent(VersionedFileViewComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check ngOnInit", () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = vi
            .spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFile")
            .mockReturnValue(of(mockVersionedFileView));
        const getVersionedFileContentUrlSpy = vi
            .spyOn(datasetAsVersionedFileService, "getVersionedFileContentUrl")
            .mockReturnValue(of(MOCK_CONTENT_URL));
        vi.spyOn(component, "setPreviewFileStrategy").mockReturnValue(Promise.resolve());

        component.version$.next(0);
        fixture.detectChanges();

        expect(requestDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
        expect(getVersionedFileContentUrlSpy).toHaveBeenCalledWith(
            mockDatasetBasicsRootFragment.id,
            mockVersionedFileEntryLatest.version,
        );
    });

    it("should check ngOnInit with version", () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = vi
            .spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFile")
            .mockReturnValue(of(mockVersionedFileView));
        const requestDatasetAsVersionedFileByVersionSpy = vi
            .spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFileByVersion")
            .mockReturnValue(of(mockVersionedFileView));
        vi.spyOn(datasetAsVersionedFileService, "getVersionedFileContentUrl").mockReturnValue(of(MOCK_CONTENT_URL));
        vi.spyOn(component, "setPreviewFileStrategy").mockReturnValue(Promise.resolve());

        component.version$.next(2);
        fixture.detectChanges();

        expect(requestDatasetAsVersionedFileByVersionSpy).toHaveBeenCalledTimes(1);
        expect(requestDatasetAsVersionedFileSpy).not.toHaveBeenCalled();
    });

    it("should check setPreviewFileStrategy method for pdf file", async () => {
        await component.setPreviewFileStrategy(contentViewOf("application/pdf"));

        expect(component.urlContentPath).toEqual(MOCK_CONTENT_URL);
    });

    it("should check setPreviewFileStrategy method for text file", async () => {
        const requestFileAsTextSpy = stubMethod(datasetAsVersionedFileService, "requestFileAsText");
        await component.setPreviewFileStrategy(contentViewOf("text/plain"));

        expect(requestFileAsTextSpy).toHaveBeenCalledTimes(1);
    });

    it("should check setPreviewFileStrategy method for video file", async () => {
        await component.setPreviewFileStrategy(contentViewOf("video/mp4"));

        expect(component.urlContentPath).toBeDefined();
    });

    it("should check setPreviewFileStrategy method for json file", async () => {
        const requestFileAsJsonSpy = stubMethod(datasetAsVersionedFileService, "requestFileAsJson");
        await component.setPreviewFileStrategy(contentViewOf("application/json"));

        expect(requestFileAsJsonSpy).toHaveBeenCalledTimes(1);
    });

    it("should check setPreviewFileStrategy method for unspported file", async () => {
        const toastrServiceInfoSpy = stubMethod(toastrService, "info");
        await component.setPreviewFileStrategy(contentViewOf("unsupported/type"));

        expect(toastrServiceInfoSpy).toHaveBeenCalledWith("Content type not supported: unsupported/type");
    });

    it("should clear the previous preview for a version whose content the node cannot serve", async () => {
        await component.setPreviewFileStrategy(contentViewOf("application/pdf"));
        await component.setPreviewFileStrategy(contentViewOf("application/pdf", null));

        expect(component.urlContentPath).toBe("");
        expect(component.pdfComponent).toBeNull();
    });

    describe("a node that cannot serve the file content", () => {
        let requestFileAsTextSpy: Mock<DatasetAsVersionedFileService["requestFileAsText"]>;

        beforeEach(() => {
            vi.spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFile").mockReturnValue(
                of(setMockObjectByContentType("text/plain")),
            );
            vi.spyOn(datasetAsVersionedFileService, "getVersionedFileContentUrl").mockReturnValue(of(null));
            requestFileAsTextSpy = stubMethod(datasetAsVersionedFileService, "requestFileAsText");

            fixture.detectChanges();
        });

        it("should say the file can't be previewed or downloaded", () => {
            const message = findElementByDataTestId(fixture, "file-content-unavailable");

            expect(message?.textContent?.trim()).toBe(VersionedFileViewTexts.CONTENT_UNAVAILABLE);
        });

        it("should not offer a download", () => {
            expect(findElementByDataTestId(fixture, "download-file-button")).toBeUndefined();
        });

        it("should not request the file content", () => {
            expect(requestFileAsTextSpy).not.toHaveBeenCalled();
        });
    });

    it("should check redirecr to latest version", () => {
        const navigateToDatasetViewSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockReturnValue();
        component.goToLatestVersionedFile();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                tab: DatasetViewTypeEnum.Overview,
            }),
        );
    });

    it("should check is latest version", () => {
        const result = component.isLatestVersion(MOCK_VERSIONED_VIEW_FILE);
        expect(result).toEqual(true);
    });

    it("should check dowmload file", () => {
        const downloadFileSpy = vi.spyOn(datasetAsVersionedFileService, "downloadFile").mockImplementation(() => {});
        component.downloadFile(MOCK_VERSIONED_VIEW_FILE);
        expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    });

    describe("a version the file does not have", () => {
        beforeEach(() => {
            vi.spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFileByVersion").mockReturnValue(
                of({ ...MOCK_VERSIONED_VIEW_FILE, fileInfo: null }),
            );

            setComponentInput(fixture, "version", 99);
            fixture.detectChanges();
        });

        it("should say there is no such version", async () => {
            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarness(ValueNotFoundHarness);

            expect(await notFound.getMessage()).toBe("There is no version 99 of this file.");
        });

        it("should lead to the latest version", async () => {
            const goToLatestSpy = stubMethod(component, "goToLatestVersionedFile");
            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarness(ValueNotFoundHarness);

            await notFound.runAction();

            expect(goToLatestSpy).toHaveBeenCalledTimes(1);
        });
    });
});
