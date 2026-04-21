/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { DatasetApi } from "@api/dataset.api";
import { VersionedFileEntryDataFragment } from "@api/kamu.graphql.interface";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    mockDatasetAsVersionedFileByBlockHashQuery,
    mockDatasetAsVersionedFileByVersionQuery,
    mockDatasetAsVersionedFileQuery,
    mockVersionedFileContentUrlQuery,
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
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
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
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const testUrl = "/bad-file.txt";

        service.requestFileAsText(testUrl).subscribe({
            complete: () => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error loading file");
            },
        });

        const req = httpMock.expectOne(testUrl);
        req.error(new ErrorEvent("Network error"));
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
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const testUrl = "/bad-file.json";

        service.requestFileAsJson(testUrl).subscribe({
            complete: () => {
                expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error loading file");
            },
        });

        const req = httpMock.expectOne(testUrl);
        req.error(new ErrorEvent("Network error"));
    });

    it("should check #requestDatasetAsVersionedFile method", () => {
        const mockVersionedFileView: VersionedFileView = {
            name: mockDatasetAsVersionedFileQuery.datasets.byId?.name as string,
            fileInfo: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile
                ?.latest as VersionedFileEntryDataFragment,
            countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions
                .totalCount as number,
        };
        const getDatasetAsVersionedFileSpy = spyOn(datasetApi, "getDatasetAsVersionedFile").and.returnValue(
            of(mockDatasetAsVersionedFileQuery),
        );

        service.requestDatasetAsVersionedFile(TEST_DATASET_ID).subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
            expect(getDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
        });
        service.versionedFileDetailsChanges.subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
        });
    });

    it("should check #requestDatasetAsVersionedFileByVersion method", () => {
        const emitLoadingFileDetailsChangedSpy = spyOn(service, "emitLoadingFileDetailsChanged");
        const mockVersionedFileView: VersionedFileView = {
            name: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.name as string,
            fileInfo: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile
                ?.asOf as VersionedFileEntryDataFragment,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions
                .totalCount as number,
        };
        const getDatasetAsVersionedFileByVersionSpy = spyOn(
            datasetApi,
            "getDatasetAsVersionedFileByVersion",
        ).and.returnValue(of(mockDatasetAsVersionedFileByVersionQuery));

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
            name: mockDatasetAsVersionedFileByBlockHashQuery.datasets.byId?.name as string,
            fileInfo: mockDatasetAsVersionedFileByBlockHashQuery.datasets.byId?.asVersionedFile
                ?.asOf as VersionedFileEntryDataFragment,
        };
        const getDatasetAsVersionedFileByBlockHashSpy = spyOn(
            datasetApi,
            "getDatasetAsVersionedFileByBlockHash",
        ).and.returnValue(of(mockDatasetAsVersionedFileByBlockHashQuery));

        service.requestDatasetAsVersionedFileByBlockHash(TEST_DATASET_ID, mockBlockHash).subscribe((data) => {
            expect(data).toEqual(mockVersionedFileView);
            expect(getDatasetAsVersionedFileByBlockHashSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check #getVersionedFileContentUrl method", () => {
        const mockResult: string = mockVersionedFileContentUrlQuery.datasets.byId?.asVersionedFile?.asOf?.contentUrl
            .url as string;
        const getVersionedFileContentUrlSpy = spyOn(datasetApi, "getVersionedFileContentUrl").and.returnValue(
            of(mockVersionedFileContentUrlQuery),
        );

        service.getVersionedFileContentUrl(TEST_DATASET_ID, MOCK_VERSION).subscribe((data) => {
            expect(data).toEqual(mockResult);
            expect(getVersionedFileContentUrlSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check #downloadFile method", () => {
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        let mockVersionedFileView: VersionedFileView = {
            name: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.name as string,
            fileInfo: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile
                ?.asOf as VersionedFileEntryDataFragment,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions
                .totalCount as number,
        };
        mockVersionedFileView.fileInfo = null;
        service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);
        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should check #downloadFile method when download file directly - URL is not expired", fakeAsync(() => {
        spyOn(service, "isUrlExpired").and.returnValue(false);
        const mockVersionedFileView: VersionedFileView = {
            name: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.name as string,
            fileInfo: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile
                ?.asOf as VersionedFileEntryDataFragment,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions
                .totalCount as number,
        };
        service.downloadFile(TEST_DATASET_ID, mockVersionedFileView);

        tick();

        const req = httpMock.expectOne(
            mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.asOf?.contentUrl.url as string,
        );
        expect(req.request.method).toBe("GET");

        flush();
    }));

    it("should check #downloadFile method when download file directly - URL is  expired", () => {
        const contentUrl = mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.asOf?.contentUrl
            .url as string;
        spyOn(service, "isUrlExpired").and.returnValue(true);
        const mockVersionedFileView: VersionedFileView = {
            name: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.name as string,
            fileInfo: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile
                ?.asOf as VersionedFileEntryDataFragment,
            countVersions: mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile?.versions
                .totalCount as number,
        };
        const getVersionedFileContentUrlSpy = spyOn(service, "getVersionedFileContentUrl").and.returnValue(
            of(contentUrl),
        );
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
