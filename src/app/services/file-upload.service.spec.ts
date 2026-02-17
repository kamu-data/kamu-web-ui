/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpHeaders, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { first, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { mockFile, mockUploadPrepareResponse } from "../api/mock/upload-file.mock";
import { AppConfigService } from "../app-config.service";
import { SharedTestModule } from "../common/modules/shared-test.module";
import { mockDatasetEndPoints } from "../data-access-panel/data-access-panel-mock.data";
import { DatasetViewComponent } from "../dataset-view/dataset-view.component";
import { mockDatasetBasicsRootFragment, mockDatasetInfo } from "../search/mock.data";
import { FileUploadService } from "./file-upload.service";
import { NavigationService } from "./navigation.service";
import { ProtocolsService } from "./protocols.service";

describe("FileUploadService", () => {
    let service: FileUploadService;
    let protocolsService: ProtocolsService;
    let appConfigService: AppConfigService;
    let httpTestingController: HttpTestingController;
    let navigationService: NavigationService;
    const mockUrl = "https://my-test";
    const urlUpload = new URL(mockUrl);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedTestModule,
                RouterTestingModule.withRoutes([{ path: "kamu/mockNameRoot", component: DatasetViewComponent }]),
            ],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(FileUploadService);
        protocolsService = TestBed.inject(ProtocolsService);
        appConfigService = TestBed.inject(AppConfigService);
        httpTestingController = TestBed.inject(HttpTestingController);
        navigationService = TestBed.inject(NavigationService);
        spyOn(navigationService, "navigateToDatasetView");
        spyOnProperty(appConfigService, "apiServerHttpUrl", "get").and.returnValue(mockUrl);
        spyOn(protocolsService, "getProtocols").and.returnValue(of(mockDatasetEndPoints));
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check upload file", () => {
        spyOn(service, "uploadFilePrepare").and.returnValue(of(mockUploadPrepareResponse));
        spyOn(service, "uploadPostFile").and.returnValue(of({}));
        spyOn(service, "ingestDataToDataset").and.returnValue(of({}));

        service
            .uploadFile(mockFile, mockDatasetBasicsRootFragment)
            .pipe(first())
            .subscribe((data) => {
                expect(data).toEqual({});
            });
    });

    it("should check #uploadFilePrepare", () => {
        service.uploadFilePrepare(mockFile).subscribe((data) => {
            expect(data).toEqual(mockUploadPrepareResponse);
        });

        const expectedUrl = `${mockUrl}/platform/file/upload/prepare?fileName=data.csv&contentLength=12&contentType=text%2Fcsv`;
        const testRequest = httpTestingController.expectOne(expectedUrl);
        expect(testRequest.request.method).toEqual("POST");
        testRequest.flush(mockUploadPrepareResponse);
    });

    it("should check #uploadPostFile", () => {
        const mockResponse = {};
        service.uploadPostFile(mockUrl, mockFile, new HttpHeaders()).subscribe((data) => {
            expect(data).toEqual(mockResponse);
        });

        const expectedUrl = mockUrl;
        const testRequest = httpTestingController.expectOne(expectedUrl);
        expect(testRequest.request.method).toEqual("POST");
        testRequest.flush(mockResponse);
    });

    it("should check #uploadPutFile", () => {
        const mockResponse = {};
        service.uploadPutFile(mockUrl, mockFile, new HttpHeaders()).subscribe((data) => {
            expect(data).toEqual(mockResponse);
        });

        const expectedUrl = mockUrl;
        const testRequest = httpTestingController.expectOne(expectedUrl);
        expect(testRequest.request.method).toEqual("PUT");
        testRequest.flush(mockResponse);
    });

    it("should check #ingestDataToDataset", () => {
        const mockResponse = {};
        const mockUploadToken = "token";
        service.ingestDataToDataset(mockDatasetInfo, mockUploadToken).subscribe((data) => {
            expect(data).toEqual(mockResponse);
        });

        const expectedUrl = "http://127.0.0.1:8080/kamu/account.tokens.portfolio/push?uploadToken=token";
        const testRequest = httpTestingController.expectOne(expectedUrl);
        expect(testRequest.request.method).toEqual("POST");
        testRequest.flush(mockResponse);
    });

    [
        { case: "fileName whitespace", expected: "fileName+whitespace" },
        { case: "fileName\\", expected: "fileName%5C" },
        { case: "fileName*", expected: "fileName*" },
        { case: "fileName#", expected: "fileName%23" },
        { case: "fileName&", expected: "fileName%26" },
        { case: "fileName>", expected: "fileName%3E" },
        { case: "fileName|", expected: "fileName%7C" },
        { case: "fileName;", expected: "fileName%3B" },
        { case: "fileName!", expected: "fileName%21" },
        { case: "fileName{", expected: "fileName%7B" },
        { case: "fileName[", expected: "fileName%5B" },
    ].forEach((item: { case: string; expected: string }) => {
        it(`should encode file name with ${item.case}`, () => {
            urlUpload.searchParams.append("filename", item.case);
            expect(urlUpload.href).toEqual(`${mockUrl}/?filename=${item.expected}`);
            urlUpload.searchParams.delete("filename");
        });
    });
});
