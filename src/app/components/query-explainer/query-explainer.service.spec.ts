import { TestBed } from "@angular/core/testing";
import { QueryExplainerService } from "./query-explainer.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { mockQueryExplainerResponse, mockVerifyQueryResponseSuccess } from "./query-explainer.mocks";
import { QueryExplainerResponse } from "./query-explainer.types";
import { AppConfigService } from "src/app/app-config.service";
import { HttpErrorResponse } from "@angular/common/http";

describe("QueryExplainerService", () => {
    let service: QueryExplainerService;
    let httpTestingController: HttpTestingController;
    let appConfigService: AppConfigService;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ToastrModule.forRoot()],
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

    it("should return commitment data", () => {
        const mockQuery = `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`;
        const mockResponse: QueryExplainerResponse = mockQueryExplainerResponse;
        service.proccessQuery(mockQuery).subscribe((data) => expect(data).toEqual(mockResponse));
        const req = httpTestingController.expectOne(`${appConfigService.apiServerHttpUrl}/query`);

        expect(req.request.method).toEqual("POST");
        req.flush(mockResponse);
    });

    it("should return error when send query", () => {
        const mockQuery = `select block_number,to from "kamu/net.rocketpool.reth.tokens-minted" order by offset limit 1`;
        const errorMessage = "Error";
        const toastrServiceSpy = spyOn(toastrService, "error");

        service.proccessQuery(mockQuery).subscribe({
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

    it("should upload commitment data bu upload token", () => {
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
});
