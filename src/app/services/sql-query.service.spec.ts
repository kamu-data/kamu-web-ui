import { TestBed } from "@angular/core/testing";
import { SqlQueryService } from "./sql-query.service";

describe("SqlQueryService", () => {
    let service: SqlQueryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SqlQueryService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
