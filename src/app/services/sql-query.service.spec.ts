/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting, TestRequest } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockQueryExplainerResponse } from "src/app/query-explainer/query-explainer.mocks";
import { mockSqlQueryRestResponse } from "src/app/search/mock.data";
import { SqlQueryService } from "src/app/services/sql-query.service";

describe("SqlQueryService", () => {
    let service: SqlQueryService;
    let httpMock: HttpTestingController;
    let loggedUserService: LoggedUserService;
    let toastrService: ToastrService;

    const QUERY = "select\n  *\nfrom testTable";
    const SERVER_MESSAGE = "Table 'testTable' not found";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(SqlQueryService);
        httpMock = TestBed.inject(HttpTestingController);
        loggedUserService = TestBed.inject(LoggedUserService);
        toastrService = TestBed.inject(ToastrService);
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get SQL query data from api", () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;

        const emitSqlQueryResponseChangedSpy = vi
            .spyOn(service, "emitSqlQueryResponseChanged")
            .mockImplementation(() => {});

        service.requestDataSqlRun({ query, limit }).subscribe(() => {
            expect(emitSqlQueryResponseChangedSpy).toHaveBeenCalledTimes(1);
        });

        const req = httpMock.expectOne((request) => request.url.includes("/query"));
        expect(req.request.method).toBe("POST");

        req.flush(mockSqlQueryRestResponse);
    });

    it("should show the rows without a proof when a proof comes without its commitment", () => {
        const emitSqlQueryResponseChangedSpy = stubMethod(service, "emitSqlQueryResponseChanged");

        service.requestDataSqlRun({ query: QUERY }).subscribe();
        expectQueryRequest().flush({ ...mockSqlQueryRestResponse, proof: mockQueryExplainerResponse.proof });

        const response = requireValue(requireValue(emitSqlQueryResponseChangedSpy.mock.lastCall)[0]);
        expect(response.content.length).toBeGreaterThan(0);
        expect(response.proofResponse).toBeUndefined();
    });

    function runFailingQuery(): void {
        service.requestDataSqlRun({ query: QUERY }).subscribe({
            next: () => expect.fail("should not emit for a failed request"),
            error: () => expect.fail("should not fail the stream"),
        });
    }

    function expectQueryRequest(): TestRequest {
        const req = httpMock.expectOne((request) => request.url.includes("/query"));
        expect(req.request.method).toBe("POST");
        return req;
    }

    it("should show the message of a 400 response as an SQL error, without a toast", () => {
        const emitSqlErrorOccurredSpy = vi.spyOn(service, "emitSqlErrorOccurred").mockImplementation(() => {});
        const toastrErrorSpy = stubMethod(toastrService, "error");

        runFailingQuery();
        expectQueryRequest().flush({ message: SERVER_MESSAGE }, { status: 400, statusText: "Bad Request" });

        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledTimes(1);

        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledWith({ error: SERVER_MESSAGE });
        expect(toastrErrorSpy).not.toHaveBeenCalled();
    });

    it("should show the plain-text body of a 400 response as an SQL error", () => {
        const emitSqlErrorOccurredSpy = vi.spyOn(service, "emitSqlErrorOccurred").mockImplementation(() => {});

        runFailingQuery();
        expectQueryRequest().flush(SERVER_MESSAGE, { status: 400, statusText: "Bad Request" });

        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledTimes(1);

        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledWith({ error: SERVER_MESSAGE });
    });

    it("should show the server message of a failed request other than 400 in a toast", () => {
        const emitSqlErrorOccurredSpy = vi.spyOn(service, "emitSqlErrorOccurred").mockImplementation(() => {});
        const toastrErrorSpy = stubMethod(toastrService, "error");

        runFailingQuery();
        expectQueryRequest().flush({ message: SERVER_MESSAGE }, { status: 500, statusText: "Internal Server Error" });

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith(SERVER_MESSAGE);
        expect(emitSqlErrorOccurredSpy).not.toHaveBeenCalled();
    });

    it("should report the host as unreachable when the request never reached the server", () => {
        const toastrErrorSpy = stubMethod(toastrService, "error");

        runFailingQuery();
        const req = expectQueryRequest();
        req.error(new ProgressEvent("error"), { status: 0, statusText: "Unknown Error" });

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith(`Unable to resolve/connect to host: ${req.request.url}`);
    });

    it("should report the host as unreachable for a failed response without a body message", () => {
        const emitSqlErrorOccurredSpy = vi.spyOn(service, "emitSqlErrorOccurred").mockImplementation(() => {});
        const toastrErrorSpy = stubMethod(toastrService, "error");

        runFailingQuery();
        const req = expectQueryRequest();
        req.flush(null, { status: 502, statusText: "Bad Gateway" });

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith(`Unable to resolve/connect to host: ${req.request.url}`);
        expect(emitSqlErrorOccurredSpy).not.toHaveBeenCalled();
    });

    it("should show the message of an error raised while reading the response", () => {
        vi.spyOn(service, "emitSqlQueryResponseChanged").mockImplementation(() => {
            throw new Error("Broken response");
        });
        const toastrErrorSpy = stubMethod(toastrService, "error");

        runFailingQuery();
        expectQueryRequest().flush(mockSqlQueryRestResponse);

        expect(toastrErrorSpy).toHaveBeenCalledTimes(1);

        expect(toastrErrorSpy).toHaveBeenCalledWith("Broken response");
    });
});
