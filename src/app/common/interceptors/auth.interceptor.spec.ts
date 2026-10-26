/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { authInterceptor } from "@common/interceptors/auth.interceptor";

import { AppConfigService } from "src/app/app-config.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

describe("authInterceptor", () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let localStorageService: LocalStorageService;
    const API_SERVER_URL = "https://api.example.com";
    const appConfigStub = {
        apiServerHttpUrl: API_SERVER_URL,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AppConfigService, useValue: appConfigStub },
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        localStorageService = TestBed.inject(LocalStorageService);
    });

    afterEach(() => {
        httpMock.verify();
        localStorageService.setAccessToken("");
        appConfigStub.apiServerHttpUrl = API_SERVER_URL;
    });

    it("should add Authorization header if token exists", () => {
        localStorageService.setAccessToken("test-token");

        http.get(`${appConfigStub.apiServerHttpUrl}/data`).subscribe();

        const req = httpMock.expectOne(`${appConfigStub.apiServerHttpUrl}/data`);

        expect(req.request.headers.has("Authorization")).toBe(true);
        expect(req.request.headers.get("Authorization")).toBe("Bearer test-token");

        req.flush({});
    });

    it("should not add Authorization header if there is no token", () => {
        localStorageService.setAccessToken(null);

        http.get(`${appConfigStub.apiServerHttpUrl}/data`).subscribe();

        const req = httpMock.expectOne(`${appConfigStub.apiServerHttpUrl}/data`);

        expect(req.request.headers.has("Authorization")).toBe(false);

        req.flush({});
    });

    it("should not add Authorization header if the token is empty", () => {
        localStorageService.setAccessToken("");

        http.get(`${appConfigStub.apiServerHttpUrl}/data`).subscribe();

        const req = httpMock.expectOne(`${appConfigStub.apiServerHttpUrl}/data`);

        expect(req.request.headers.has("Authorization")).toBe(false);

        req.flush({});
    });

    it("should keep the headers the request already has", () => {
        localStorageService.setAccessToken("test-token");

        http.get(`${appConfigStub.apiServerHttpUrl}/data`, {
            headers: new HttpHeaders().set("Accept", "application/json"),
        }).subscribe();

        const req = httpMock.expectOne(`${appConfigStub.apiServerHttpUrl}/data`);

        expect(req.request.headers.get("Accept")).toBe("application/json");
        expect(req.request.headers.get("Authorization")).toBe("Bearer test-token");

        req.flush({});
    });

    it("should not add Authorization header when requesting another domain", () => {
        localStorageService.setAccessToken("test-token");

        http.get("https://other.example.com/data").subscribe();

        const req = httpMock.expectOne("https://other.example.com/data");

        expect(req.request.headers.has("Authorization")).toBe(false);

        req.flush({});
    });

    [
        { apiServerHttpUrl: API_SERVER_URL, url: "https://api.example.com.evil.com/data", authorized: false },
        { apiServerHttpUrl: API_SERVER_URL, url: "https://api.example.com:8443/data", authorized: false },
        { apiServerHttpUrl: API_SERVER_URL, url: "http://api.example.com/data", authorized: false },
        { apiServerHttpUrl: "https://example.com/api", url: "https://example.com/api/graphql", authorized: true },
        { apiServerHttpUrl: "https://example.com/api", url: "https://example.com/api", authorized: true },
        { apiServerHttpUrl: "https://example.com/api/", url: "https://example.com/api/graphql", authorized: true },
        { apiServerHttpUrl: "https://example.com/api", url: "https://example.com/apiary/data", authorized: false },
    ].forEach(({ apiServerHttpUrl, url, authorized }) => {
        it(`should ${authorized ? "" : "not "}authorize ${url} for the API server ${apiServerHttpUrl}`, () => {
            appConfigStub.apiServerHttpUrl = apiServerHttpUrl;
            localStorageService.setAccessToken("test-token");

            http.get(url).subscribe();

            const req = httpMock.expectOne(url);
            expect(req.request.headers.has("Authorization")).toBe(authorized);
            req.flush({});
        });
    });
});
