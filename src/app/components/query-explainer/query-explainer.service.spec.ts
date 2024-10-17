import { TestBed } from "@angular/core/testing";
import { QueryExplainerService } from "./query-explainer.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";

describe("QueryExplainerService", () => {
    let service: QueryExplainerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(QueryExplainerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
