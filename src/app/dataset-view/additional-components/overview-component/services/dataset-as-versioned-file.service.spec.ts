/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    MOCK_VERSIONED_FILE_NAME,
    mockDatasetAsVersionedFileByBlockHashQuery,
    mockDatasetAsVersionedFileByVersionQuery,
    mockDatasetAsVersionedFileQuery,
    mockVersionedFileContentUrlQuery,
    mockVersionedFileEntryByBlockHash,
    mockVersionedFileEntryByVersion,
    mockVersionedFileEntryLatest,
} from "src/app/search/mock.data";

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
        const emitLoadingFileDetailsChangedSpy = vi
            .spyOn(service, "emitLoadingFileDetailsChanged")
            .mockImplementation(() => {});
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
        expect(emitLoadingFileDetailsChangedSpy).toHaveBeenCalledTimes(2);
    });

    it("should check #requestDatasetAsVersionedFileByBlockHash method", () => {
        const mockBlockHash = "12343";
        const mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryByBlockHash,
        };
        const getDatasetAsVersionedFileByBlockHashSpy = vi
            .spyOn(datasetApi, "getDatasetAsVersionedFileByBlockHash")
            .mockReturnValue(of(mockDatasetAsVersionedFileByBlockHashQuery));

        service.requestDatasetAsVersionedFileByBlockHash(TEST_DATASET_ID, mockBlockHash).subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
            expect(getDatasetAsVersionedFileByBlockHashSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check #getVersionedFileContentUrl method", () => {
        const mockResult = requireValue(
            mockVersionedFileContentUrlQuery.datasets.byId?.asVersionedFile?.asOf?.contentUrl.url,
        );
        const getVersionedFileContentUrlSpy = vi
            .spyOn(datasetApi, "getVersionedFileContentUrl")
            .mockReturnValue(of(mockVersionedFileContentUrlQuery));

        service.getVersionedFileContentUrl(TEST_DATASET_ID, MOCK_VERSION).subscribe((data) => {
            expect(data).toEqual(mockResult);
            expect(getVersionedFileContentUrlSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check #downloadFile method", () => {
        const toastrServiceErrorSpy = stubMethod(toastService, "error");
        let mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryByVersion,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
        };
        mockVersionedFileView.fileInfo = null;
        service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);
        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #downloadFile method when download file directly - URL is not expired", fakeAsync(() => {
        vi.spyOn(service, "isUrlExpired").mockReturnValue(false);
        const mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryByVersion,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
        };
        service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);

        tick();

        const req = httpMock.expectOne(mockVersionedFileEntryByVersion.contentUrl.url);
        expect(req.request.method).toBe("GET");

        flush();
    }));

    it("should check #downloadFile method when download file directly - URL is  expired", () => {
        const contentUrl = mockVersionedFileEntryByVersion.contentUrl.url;
        vi.spyOn(service, "isUrlExpired").mockReturnValue(true);
        const mockVersionedFileView: VersionedFileView = {
            name: MOCK_VERSIONED_FILE_NAME,
            fileInfo: mockVersionedFileEntryByVersion,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
        };
        const getVersionedFileContentUrlSpy = vi
            .spyOn(service, "getVersionedFileContentUrl")
            .mockReturnValue(of(contentUrl));
        service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);

        const req = httpMock.expectOne(contentUrl);
        expect(req.request.method).toBe("GET");
        expect(getVersionedFileContentUrlSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #isUrlExpired expired", () => {
        let result = service.isUrlExpired(null);
        expect(result).toEqual(true);

        result = service.isUrlExpired(new Date().toISOString());
        expect(result).toEqual(true);
    });
});
