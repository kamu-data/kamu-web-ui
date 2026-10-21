/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { environment } from "@env/environment";
import { spinnerInterceptor } from "@common/components/spinner/spinner.interceptor";
import { SpinnerService } from "@common/components/spinner/spinner.service";
import AppValues from "@common/values/app.values";

describe("spinnerInterceptor", () => {
    const API_URL = "https://api.example.com/graphql";
    const DELAY_MS = environment.delay_http_request_ms;

    let http: HttpClient;
    let httpMock: HttpTestingController;
    let spinnerService: SpinnerService;
    let loadingStates: boolean[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([spinnerInterceptor])), provideHttpClientTesting()],
        });
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        spinnerService = TestBed.inject(SpinnerService);
        loadingStates = [];
        spinnerService.isLoadingChanges.subscribe((isLoading) => loadingStates.push(isLoading));
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should show the spinner after the delay and hide it when the request ends", fakeAsync(() => {
        http.get(API_URL).subscribe();
        tick(DELAY_MS);
        expect(loadingStates).toEqual([true]);

        httpMock.expectOne(API_URL).flush({});
        expect(loadingStates).toEqual([true, false]);
    }));

    it("should not show the spinner for a request that ends before the delay", fakeAsync(() => {
        http.get(API_URL).subscribe();
        httpMock.expectOne(API_URL).flush({});
        tick(DELAY_MS);

        expect(loadingStates).toEqual([false]);
    }));

    it("should hide the spinner when the request fails", fakeAsync(() => {
        http.get(API_URL).subscribe({ error: () => undefined });
        tick(DELAY_MS);

        httpMock.expectOne(API_URL).flush("", { status: 500, statusText: "Server Error" });

        expect(loadingStates).toEqual([true, false]);
    }));

    it("should keep the spinner while another request is still pending", fakeAsync(() => {
        http.get(`${API_URL}?first`).subscribe();
        http.get(`${API_URL}?second`).subscribe();
        tick(DELAY_MS);

        httpMock.expectOne(`${API_URL}?first`).flush({});
        expect(loadingStates).toEqual([true]);

        httpMock.expectOne(`${API_URL}?second`).flush({});
        expect(loadingStates).toEqual([true, false]);
    }));

    it("should skip requests for assets", fakeAsync(() => {
        http.get("/assets/runtime-config.json").subscribe();
        tick(DELAY_MS);
        httpMock.expectOne("/assets/runtime-config.json").flush({});

        expect(loadingStates).toEqual([]);
    }));

    it("should skip requests with the skip-loading header", fakeAsync(() => {
        http.get(API_URL, { headers: new HttpHeaders().set(AppValues.HEADERS_SKIP_LOADING_KEY, "true") }).subscribe();
        tick(DELAY_MS);
        httpMock.expectOne(API_URL).flush({});

        expect(loadingStates).toEqual([]);
    }));
});
