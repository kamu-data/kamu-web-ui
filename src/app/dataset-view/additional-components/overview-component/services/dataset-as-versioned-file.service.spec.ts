/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpHeaders, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { DatasetApi } from "@api/dataset.api";
import {
    FinishUploadNewVersionMutation,
    StartUploadNewVersionMutation,
    VersionedFileEntryDataFragment,
} from "@api/kamu.graphql.interface";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";
import { UploadPrepareResponse } from "@interface/ingest-via-file-upload.types";

import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";
import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    mockDatasetAsVersionedFileByBlockHashQuery,
    mockDatasetAsVersionedFileByVersionQuery,
    mockDatasetAsVersionedFileQuery,
    mockDatasetBasicsRootFragment,
    mockVersionedFileContentUrlQuery,
} from "src/app/search/mock.data";
import { FileUploadService } from "src/app/services/file-upload.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ProtocolsService } from "src/app/services/protocols.service";

import { DatasetAsVersionedFileService } from "./dataset-as-versioned-file.service";

describe("DatasetAsVersionedFileService", () => {
    let service: DatasetAsVersionedFileService;
    let toastService: ToastrService;
    let httpMock: HttpTestingController;
    let datasetApi: DatasetApi;
    let fileUploadService: FileUploadService;
    let localStorageService: LocalStorageService;
    let navigationService: NavigationService;
    let protocolsService: ProtocolsService;

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
        fileUploadService = TestBed.inject(FileUploadService);
        localStorageService = TestBed.inject(LocalStorageService);
        navigationService = TestBed.inject(NavigationService);
        protocolsService = TestBed.inject(ProtocolsService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should initialize file details loader as disabled", () => {
        service.loadingFileDetailsChanges.subscribe((isLoading) => {
            expect(isLoading).toBeFalse();
        });
    });

    it("should prepare a versioned file upload", () => {
        const response: StartUploadNewVersionMutation = {
            datasets: {
                byId: {
                    asVersionedFile: {
                        startUploadNewVersion: {
                            __typename: "StartUploadVersionSuccess",
                            url: "https://example.com/upload",
                            method: "PUT",
                            isSuccess: true,
                            uploadToken: "upload-token",
                            useMultipart: false,
                            message: "Success",
                            headers: [{ key: "x-upload-header", value: "header-value" }],
                        },
                    },
                },
            },
        };
        const startUploadSpy = spyOn(datasetApi, "startUploadVersionedFile").and.returnValue(of(response));

        service
            .uploadFilePrepare({
                datasetId: TEST_DATASET_ID,
                contentLength: 42,
                contentType: "text/plain",
            })
            .subscribe((result) => {
                expect(result).toEqual({
                    uploadToken: "upload-token",
                    uploadUrl: "https://example.com/upload",
                    method: "PUT",
                    useMultipart: false,
                    headers: [["x-upload-header", "header-value"]],
                    fields: [],
                });
            });

        expect(startUploadSpy).toHaveBeenCalledOnceWith({
            datasetId: TEST_DATASET_ID,
            contentLength: 42,
            contentType: "text/plain",
        });
    });

    it("should report an error when preparing a versioned file upload fails", () => {
        const response: StartUploadNewVersionMutation = {
            datasets: {
                byId: {
                    asVersionedFile: {
                        startUploadNewVersion: {
                            __typename: "StartUploadVersionErrorTooLarge",
                            isSuccess: false,
                            message: "File is too large",
                            uploadSize: 42,
                            uploadLimit: 10,
                        },
                    },
                },
            },
        };
        spyOn(datasetApi, "startUploadVersionedFile").and.returnValue(of(response));
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const nextSpy = jasmine.createSpy("next");

        service
            .uploadFilePrepare({
                datasetId: TEST_DATASET_ID,
                contentLength: 42,
                contentType: "text/plain",
            })
            .subscribe(nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(toastrServiceErrorSpy).toHaveBeenCalledOnceWith("File is too large");
    });

    it("should finish a versioned file upload", () => {
        const response: FinishUploadNewVersionMutation = {
            datasets: {
                byId: {
                    asVersionedFile: {
                        finishUploadNewVersion: {
                            __typename: "UpdateVersionSuccess",
                            isSuccess: true,
                            message: "Success",
                            newVersion: 3,
                        },
                    },
                },
            },
        };
        const finishUploadSpy = spyOn(datasetApi, "finishUploadVersionedFile").and.returnValue(of(response));

        service
            .finishUploadFile({
                datasetId: TEST_DATASET_ID,
                uploadToken: "upload-token",
            })
            .subscribe((newVersion) => {
                expect(newVersion).toBe(3);
            });

        expect(finishUploadSpy).toHaveBeenCalledOnceWith({
            datasetId: TEST_DATASET_ID,
            uploadToken: "upload-token",
        });
    });

    it("should report an error when finishing a versioned file upload fails", () => {
        const response: FinishUploadNewVersionMutation = {
            datasets: {
                byId: {
                    asVersionedFile: {
                        finishUploadNewVersion: {
                            __typename: "UpdateVersionErrorQuotaExceeded",
                            isSuccess: false,
                            message: "Quota exceeded",
                        },
                    },
                },
            },
        };
        spyOn(datasetApi, "finishUploadVersionedFile").and.returnValue(of(response));
        const toastrServiceErrorSpy = spyOn(toastService, "error");
        const nextSpy = jasmine.createSpy("next");

        service
            .finishUploadFile({
                datasetId: TEST_DATASET_ID,
                uploadToken: "upload-token",
            })
            .subscribe(nextSpy);

        expect(nextSpy).not.toHaveBeenCalled();
        expect(toastrServiceErrorSpy).toHaveBeenCalledOnceWith("Quota exceeded");
    });

    it("should upload a file, finish the upload, and navigate to the new version", () => {
        const file = new File(["content"], "file.txt", { type: "text/plain" });
        const uploadPrepareResponse: UploadPrepareResponse = {
            uploadToken: "upload-token",
            uploadUrl: "https://example.com/upload",
            method: "PUT",
            useMultipart: false,
            headers: [],
            fields: [],
        };
        const uploadHeaders = new HttpHeaders();
        spyOn(service, "uploadFilePrepare").and.returnValue(of(uploadPrepareResponse));
        const prepareUploadDataSpy = spyOn(fileUploadService, "prepareUploadData").and.returnValue(
            of({
                uploadPrepareResponse,
                bodyObject: file,
                uploadHeaders,
            }),
        );
        const uploadFileByMethodSpy = spyOn(fileUploadService, "uploadFileByMethod").and.returnValue(of({}));
        const finishUploadFileSpy = spyOn(service, "finishUploadFile").and.returnValue(of(3));
        const updatePageSpy = spyOn(service, "updatePage");

        service.uploadVersionedFile(file, mockDatasetBasicsRootFragment).subscribe((newVersion) => {
            expect(newVersion).toBe(3);
        });

        expect(prepareUploadDataSpy).toHaveBeenCalledOnceWith(uploadPrepareResponse, file);
        expect(uploadFileByMethodSpy).toHaveBeenCalledOnceWith(
            "PUT",
            "https://example.com/upload",
            file,
            uploadHeaders,
        );
        expect(finishUploadFileSpy).toHaveBeenCalledOnceWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            uploadToken: "upload-token",
        });
        expect(updatePageSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment, 3);
    });

    it("should navigate to a specific versioned file version", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        service.updatePage(mockDatasetBasicsRootFragment, 3);

        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
            version: "3",
        });
    });

    it("should roll back to the previous file contents as a new version", () => {
        const currentVersion = 3;
        const previousFileInfo = mockDatasetAsVersionedFileByVersionQuery.datasets.byId?.asVersionedFile
            ?.asOf as VersionedFileEntryDataFragment;
        const getFileByVersionSpy = spyOn(datasetApi, "getDatasetAsVersionedFileByVersion").and.returnValue(
            of(mockDatasetAsVersionedFileByVersionQuery),
        );
        const getProtocolsSpy = spyOn(protocolsService, "getProtocols").and.returnValue(of(mockDatasetEndPoints));
        spyOnProperty(localStorageService, "accessToken", "get").and.returnValue("access-token");
        const emitLoadingSpy = spyOn(service, "emitLoadingFileDetailsChanged");
        const updatePageSpy = spyOn(service, "updatePage");

        service.rollBackVersionedFile(mockDatasetBasicsRootFragment, currentVersion);

        const request = httpMock.expectOne(mockDatasetEndPoints.rest.pushUrl);
        expect(request.request.method).toBe("POST");
        expect(request.request.headers.get("Authorization")).toBe("Bearer access-token");
        expect(request.request.body).toEqual([
            {
                version: currentVersion + 1,
                content_hash: previousFileInfo.contentHash,
                content_length: previousFileInfo.contentLength,
                content_type: previousFileInfo.contentType,
            },
        ]);
        request.flush({});

        expect(getFileByVersionSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment.id, currentVersion - 1);
        expect(getProtocolsSpy).toHaveBeenCalledOnceWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
        });
        expect(emitLoadingSpy.calls.allArgs()).toEqual([[true], [false]]);
        expect(updatePageSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment, currentVersion + 1);
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
