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

import { LoggedUserService } from "src/app/auth/logged-user.service";
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
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
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

        const emitSqlQueryResponseChangedSpy = spyOn(service, "emitSqlQueryResponseChanged");

        service.requestDataSqlRun({ query, limit }).subscribe(() => {
            expect(emitSqlQueryResponseChangedSpy).toHaveBeenCalledTimes(1);
        });

        const req = httpMock.expectOne((request) => request.url.includes("/query"));
        expect(req.request.method).toBe("POST");

        req.flush(mockSqlQueryRestResponse);
    });

    function runFailingQuery(): void {
        service.requestDataSqlRun({ query: QUERY }).subscribe({
            next: () => fail("should not emit for a failed request"),
            error: () => fail("should not fail the stream"),
        });
    }

    function expectQueryRequest(): TestRequest {
        const req = httpMock.expectOne((request) => request.url.includes("/query"));
        expect(req.request.method).toBe("POST");
        return req;
    }

    it("should show the message of a 400 response as an SQL error, without a toast", () => {
        const emitSqlErrorOccurredSpy = spyOn(service, "emitSqlErrorOccurred");
        const toastrErrorSpy = spyOn(toastrService, "error");

        runFailingQuery();
        expectQueryRequest().flush({ message: SERVER_MESSAGE }, { status: 400, statusText: "Bad Request" });

        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledOnceWith({ error: SERVER_MESSAGE });
        expect(toastrErrorSpy).not.toHaveBeenCalled();
    });

    it("should show the plain-text body of a 400 response as an SQL error", () => {
        const emitSqlErrorOccurredSpy = spyOn(service, "emitSqlErrorOccurred");

        runFailingQuery();
        expectQueryRequest().flush(SERVER_MESSAGE, { status: 400, statusText: "Bad Request" });

        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledOnceWith({ error: SERVER_MESSAGE });
    });

    it("should show the server message of a failed request other than 400 in a toast", () => {
        const emitSqlErrorOccurredSpy = spyOn(service, "emitSqlErrorOccurred");
        const toastrErrorSpy = spyOn(toastrService, "error");

        runFailingQuery();
        expectQueryRequest().flush({ message: SERVER_MESSAGE }, { status: 500, statusText: "Internal Server Error" });

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith(SERVER_MESSAGE);
        expect(emitSqlErrorOccurredSpy).not.toHaveBeenCalled();
    });

    it("should report the host as unreachable when the request never reached the server", () => {
        const toastrErrorSpy = spyOn(toastrService, "error");

        runFailingQuery();
        const req = expectQueryRequest();
        req.error(new ProgressEvent("error"), { status: 0, statusText: "Unknown Error" });

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith(`Unable to resolve/connect to host: ${req.request.url}`);
    });

    it("should report the host as unreachable for a failed response without a body message", () => {
        const emitSqlErrorOccurredSpy = spyOn(service, "emitSqlErrorOccurred");
        const toastrErrorSpy = spyOn(toastrService, "error");

        runFailingQuery();
        const req = expectQueryRequest();
        req.flush(null, { status: 502, statusText: "Bad Gateway" });

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith(`Unable to resolve/connect to host: ${req.request.url}`);
        expect(emitSqlErrorOccurredSpy).not.toHaveBeenCalled();
    });

    it("should show the message of an error raised while reading the response", () => {
        spyOn(service, "emitSqlQueryResponseChanged").and.throwError("Broken response");
        const toastrErrorSpy = spyOn(toastrService, "error");

        runFailingQuery();
        expectQueryRequest().flush(mockSqlQueryRestResponse);

        expect(toastrErrorSpy).toHaveBeenCalledOnceWith("Broken response");
    });
});
