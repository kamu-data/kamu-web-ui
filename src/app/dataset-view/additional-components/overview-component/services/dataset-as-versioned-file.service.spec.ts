/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { Mock } from "vitest";

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    MOCK_VERSIONED_FILE_NAME,
    mockDatasetAsVersionedFileByVersionQuery,
    mockDatasetAsVersionedFileQuery,
    mockVersionedFileContentUrlQuery,
    mockVersionedFileEntryByVersion,
    mockVersionedFileEntryLatest,
} from "src/app/search/mock.data";

import { VersionedFileViewTexts } from "../components/versioned-file-view/versioned-file-view.text";
import { DatasetAsVersionedFileService } from "./dataset-as-versioned-file.service";

describe("DatasetAsVersionedFileService", () => {
    let service: DatasetAsVersionedFileService;
    let toastService: ToastrService;
    let httpMock: HttpTestingController;
    let datasetApi: DatasetApi;

    const MOCK_VERSION = 2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(DatasetAsVersionedFileService);
        toastService = TestBed.inject(ToastrService);
        httpMock = TestBed.inject(HttpTestingController);
        datasetApi = TestBed.inject(DatasetApi);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check #requestFileAsText with success", () => {
        const mockContent = "hello world";
        const testUrl = "/test-file.txt";

        service.requestFileAsText(testUrl).subscribe((data) => {
            expect(data).toBe(mockContent);
        });

        const req = httpMock.expectOne(testUrl);
        expect(req.request.method).toBe("GET");
        req.flush(mockContent);
    });

    it("should check #requestFileAsText with error", () => {
        const toastrServiceErrorSpy = stubMethod(toastService, "error");
        const testUrl = "/bad-file.txt";

        service.requestFileAsText(testUrl).subscribe({
            complete: () => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error loading file");
            },
        });

        const req = httpMock.expectOne(testUrl);
        req.error(new ProgressEvent("error"));
    });

    it("should check #requestFileAsJson with success", () => {
        const mockContent = { a: 1 };
        const testUrl = "/test-file.json";

        service.requestFileAsJson(testUrl).subscribe((data) => {
            expect(data).toBe(mockContent);
        });

        const req = httpMock.expectOne(testUrl);
        expect(req.request.method).toBe("GET");
        req.flush(mockContent);
    });

    it("should check #requestFileAsJson with error", () => {
        const toastrServiceErrorSpy = stubMethod(toastService, "error");
        const testUrl = "/bad-file.json";

        service.requestFileAsJson(testUrl).subscribe({
            complete: () => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error loading file");
            },
        });

        const req = httpMock.expectOne(testUrl);
        req.error(new ProgressEvent("error"));
    });

    it("should check #requestDatasetAsVersionedFile method", () => {
        const mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryLatest,
            countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
        };
        const getDatasetAsVersionedFileSpy = vi
            .spyOn(datasetApi, "getDatasetAsVersionedFile")
            .mockReturnValue(of(mockDatasetAsVersionedFileQuery));

        service.requestDatasetAsVersionedFile(TEST_DATASET_ID).subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
            expect(getDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
        });
        service.versionedFileDetailsChanges.subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
        });
    });

    it("should check #requestDatasetAsVersionedFileByVersion method", () => {
        const mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryByVersion,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
        };
        const getDatasetAsVersionedFileByVersionSpy = vi
            .spyOn(datasetApi, "getDatasetAsVersionedFileByVersion")
            .mockReturnValue(of(mockDatasetAsVersionedFileByVersionQuery));

        service.requestDatasetAsVersionedFileByVersion(TEST_DATASET_ID, MOCK_VERSION).subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
            expect(getDatasetAsVersionedFileByVersionSpy).toHaveBeenCalledTimes(1);
        });
        service.versionedFileDetailsChanges.subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
        });
    });

    it("should check #getVersionedFileContentUrl method", async () => {
        const mockResult = requireValue(
            mockVersionedFileContentUrlQuery.datasets.byId?.asVersionedFile?.asOf?.contentUrl.url,
        );
        const getVersionedFileContentUrlSpy = vi
            .spyOn(datasetApi, "getVersionedFileContentUrl")
            .mockReturnValue(of(mockVersionedFileContentUrlQuery));

        const url = await firstValueFrom(service.getVersionedFileContentUrl(TEST_DATASET_ID, MOCK_VERSION));

        expect(url).toEqual(mockResult);
        expect(getVersionedFileContentUrlSpy).toHaveBeenCalledWith(TEST_DATASET_ID, MOCK_VERSION);
    });

    it("should give no content URL when the node cannot serve the file content", async () => {
        vi.spyOn(datasetApi, "getVersionedFileContentUrl").mockReturnValue(
            throwError(() => new Error("Repository does not support external transfers")),
        );

        const url = await firstValueFrom(service.getVersionedFileContentUrl(TEST_DATASET_ID, MOCK_VERSION));

        expect(url).toBeNull();
    });

    describe("#downloadFile", () => {
        const CONTENT_URL = "https://example.com/file-content";
        const mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryByVersion,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
        };
        let toastrServiceErrorSpy: Mock<ToastrService["error"]>;

        beforeEach(() => {
            toastrServiceErrorSpy = stubMethod(toastService, "error");
        });

        it("should do nothing for a file without versions", () => {
            const getVersionedFileContentUrlSpy = vi.spyOn(service, "getVersionedFileContentUrl");

            service.downloadFile(TEST_DATASET_ID, { ...mockVersionedFileView, fileInfo: null });

            expect(getVersionedFileContentUrlSpy).not.toHaveBeenCalled();
            expect(toastrServiceErrorSpy).not.toHaveBeenCalled();
        });

        it("should download the file from a fresh content URL", () => {
            const getVersionedFileContentUrlSpy = vi
                .spyOn(service, "getVersionedFileContentUrl")
                .mockReturnValue(of(CONTENT_URL));

            service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);

            const req = httpMock.expectOne(CONTENT_URL);
            expect(req.request.method).toBe("GET");
            expect(getVersionedFileContentUrlSpy).toHaveBeenCalledWith(
                TEST_DATASET_ID,
                mockVersionedFileEntryByVersion.version,
            );
        });

        it("should say the file can't be downloaded when the node cannot serve its content", () => {
            vi.spyOn(service, "getVersionedFileContentUrl").mockReturnValue(of(null));

            service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);

            httpMock.expectNone(() => true);
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith(VersionedFileViewTexts.DOWNLOAD_UNAVAILABLE);
        });

        it("should report a failed download", () => {
            vi.spyOn(service, "getVersionedFileContentUrl").mockReturnValue(of(CONTENT_URL));

            service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);
            httpMock.expectOne(CONTENT_URL).flush(new Blob(), { status: 500, statusText: "Server Error" });

            expect(toastrServiceErrorSpy).toHaveBeenCalledWith(VersionedFileViewTexts.DOWNLOAD_FAILED);
        });
    });
});
