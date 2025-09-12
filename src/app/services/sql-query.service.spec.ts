/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { SqlQueryService } from "./sql-query.service";
import { mockSqlQueryRestResponse } from "../search/mock.data";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LoggedUserService } from "../auth/logged-user.service";

describe("SqlQueryService", () => {
    let service: SqlQueryService;
    let httpMock: HttpTestingController;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [Apollo],
        });
        service = TestBed.inject(SqlQueryService);
        httpMock = TestBed.inject(HttpTestingController);
        loggedUserService = TestBed.inject(LoggedUserService);
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

    it("should check to geherate error", () => {
        const query = "select\n  *\nfrom testTable";

        const emitSqlErrorOccurredSpy = spyOn(service, "emitSqlErrorOccurred");

        service.requestDataSqlRun({ query }).subscribe({
            next: () => {},
            error: () => fail("error"),
        });

        const req = httpMock.expectOne((request) => request.url.includes("/query"));
        expect(req.request.method).toBe("POST");

        req.flush({ message: "Server message" }, { status: 500, statusText: "Server Error" });
        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledTimes(1);
    });
});
