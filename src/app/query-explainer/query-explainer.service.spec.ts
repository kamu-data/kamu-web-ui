/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { AppConfigService } from "src/app/app-config.service";
import {
    mockQueryExplainerResponse,
    mockVerifyQueryResponseSuccess,
} from "src/app/query-explainer/query-explainer.mocks";
import { QueryExplainerService } from "src/app/query-explainer/query-explainer.service";
import { QueryExplainerResponse } from "src/app/query-explainer/query-explainer.types";

describe("QueryExplainerService", () => {
    let service: QueryExplainerService;
    let httpTestingController: HttpTestingController;
    let appConfigService: AppConfigService;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Apollo,
                provideAnimations(),
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(QueryExplainerService);
        appConfigService = TestBed.inject(AppConfigService);
        toastrService = TestBed.inject(ToastrService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should proces query with proof", () => {
        const mockQuery = `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`;
        service.processQueryWithProof(mockQuery).subscribe((data) => expect(data).toEqual(mockQueryExplainerResponse));
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/query`);

        expect(req.request.method).toEqual("POST");
        req.flush(mockQueryExplainerResponse);
    });

    it("should proces query with proof with error", () => {
        const errorMessage = "Error";
        const toastrServiceSpy = spyOn(toastrService, "error");

        const mockQuery = `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`;
        service.processQueryWithProof(mockQuery).subscribe({
            next: () => fail("should have failed with the 404 error"),
            error: (error: HttpErrorResponse) => {
                expect(error.status).withContext("status").toEqual(404);
                expect(error.message).withContext("message").toEqual(errorMessage);
            },
        });
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/query`);

        expect(req.request.method).toEqual("POST");
        req.flush(errorMessage, { status: 404, statusText: "Not Found" });
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should return commitment data", () => {
        const mockQuery = `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`;
        const mockResponse: QueryExplainerResponse = mockQueryExplainerResponse;
        service.processQueryWithSchema(mockQuery).subscribe((data) => expect(data).toEqual(mockResponse));
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/query`);

        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual(jasmine.objectContaining({ include: ["Schema"], query: mockQuery }));
        req.flush(mockResponse);
    });

    it("should return error when send query", () => {
        const mockQuery = `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`;
        const errorMessage = "Error";
        const toastrServiceSpy = spyOn(toastrService, "error");

        service.processQueryWithSchema(mockQuery).subscribe({
            next: () => fail("should have failed with the 404 error"),
            error: (error: HttpErrorResponse) => {
                expect(error.status).withContext("status").toEqual(404);
                expect(error.message).withContext("message").toEqual(errorMessage);
            },
        });
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/query`);
        req.flush(errorMessage, { status: 404, statusText: "Not Found" });
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should verify query", () => {
        const mockResponse: QueryExplainerResponse = mockQueryExplainerResponse;
        service.verifyQuery(mockResponse).subscribe((data) => expect(data).toEqual(mockVerifyQueryResponseSuccess));
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/verify`);

        expect(req.request.method).toEqual("POST");
        req.flush(mockVerifyQueryResponseSuccess);
    });

    it("should return unsupported error when verify query", () => {
        const errorMessage = "Error";
        const toastrServiceSpy = spyOn(toastrService, "error");

        service.verifyQuery(mockQueryExplainerResponse).subscribe({
            next: () => fail("should have failed with the 404 error"),
            error: (error: HttpErrorResponse) => {
                expect(error.status).withContext("status").toEqual(404);
                expect(error.message).withContext("message").toEqual(errorMessage);
            },
        });
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/verify`);
        req.flush(errorMessage, { status: 404, statusText: "Not found" });
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should upload commitment data by upload token", () => {
        const mockUploadToken = "sadsaJJWwccdfdf";
        service
            .fetchCommitmentDataByUploadToken(mockUploadToken)
            .subscribe((data) => expect(data).toEqual(mockQueryExplainerResponse));
        const req = httpTestingController.expectOne(
            `${appConfigService.apiServerHttpUrl}/platform/file/upload/${mockUploadToken}`,
        );

        expect(req.request.method).toEqual("GET");
        req.flush(mockQueryExplainerResponse);
    });

    it("should return error when fetch commitment data by upload token", () => {
        const errorMessage = "Uploaded file not found on the server";
        const toastrServiceSpy = spyOn(toastrService, "error");
        const uploadToken = "dfdflLKDsddfdddlfdsdsjkpbfopofoFDdfdf";

        service.fetchCommitmentDataByUploadToken(uploadToken).subscribe({
            next: () => fail("should have failed with the 404 error"),
            error: (error: HttpErrorResponse) => {
                expect(error.status).withContext("status").toEqual(404);
                expect(error.message).withContext("message").toEqual(errorMessage);
            },
        });
        const req = httpTestingController.expectOne(
            `${appConfigService.apiServerHttpUrl}/platform/file/upload/${uploadToken}`,
        );

        req.flush({ message: errorMessage }, { status: 404, statusText: "Not found" });
        expect(toastrServiceSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSpy).toHaveBeenCalledWith("", errorMessage, {
            disableTimeOut: "timeOut",
        });
    });
});
