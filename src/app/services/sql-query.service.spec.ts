/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockSqlQueryRestResponse } from "src/app/search/mock.data";
import { SqlQueryService } from "src/app/services/sql-query.service";

describe("SqlQueryService", () => {
    let service: SqlQueryService;
    let httpMock: HttpTestingController;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
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

        req.flush({ message: "Server message" }, { status: 400, statusText: "Server Error" });
        expect(emitSqlErrorOccurredSpy).toHaveBeenCalledTimes(1);
    });
});
