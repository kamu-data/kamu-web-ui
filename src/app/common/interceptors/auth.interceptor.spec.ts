/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { AuthInterceptor } from "./auth.interceptor";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { AppConfigService } from "src/app/app-config.service";

describe("AuthInterceptor", () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let localStorageService: LocalStorageService;
    const appConfigStub = {
        apiServerHttpUrl: "https://api.example.com",
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthInterceptor,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                },
                { provide: AppConfigService, useValue: appConfigStub },
            ],
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        localStorageService = TestBed.inject(LocalStorageService);
    });

    afterEach(() => {
        httpMock.verify();
        localStorageService.setAccessToken("");
    });

    it("should be created", () => {
        const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
        expect(interceptor).toBeTruthy();
    });

    it("should add Authorization header if token exists", () => {
        localStorageService.setAccessToken("test-token");

        http.get(`${appConfigStub.apiServerHttpUrl}/data`).subscribe();

        const req = httpMock.expectOne(`${appConfigStub.apiServerHttpUrl}/data`);

        expect(req.request.headers.has("Authorization")).toBeTrue();
        expect(req.request.headers.get("Authorization")).toBe("Bearer test-token");

        req.flush({});
    });

    it("should not add Authorization header if there is no token", () => {
        localStorageService.setAccessToken(null);

        http.get(`${appConfigStub.apiServerHttpUrl}/data`).subscribe();

        const req = httpMock.expectOne(`${appConfigStub.apiServerHttpUrl}/data`);

        expect(req.request.headers.has("Authorization")).toBeFalse();

        req.flush({});
    });

    it("should not add Authorization header  when requesting another domain", () => {
        localStorageService.setAccessToken("test-token");

        http.get("https://other.example.com/data").subscribe();

        const req = httpMock.expectOne("https://other.example.com/data");

        expect(req.request.headers.has("Authorization")).toBeFalse();

        req.flush({});
    });
});
