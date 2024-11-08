import { TestBed } from "@angular/core/testing";
import { GlobalQueryService } from "./global-query.service";

describe("GlobalQueryService", () => {
    let service: GlobalQueryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GlobalQueryService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
