import { TestBed } from "@angular/core/testing";
import { DatasetCompactingService } from "./dataset-compacting.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";

describe("DatasetCompactingService", () => {
    let service: DatasetCompactingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(DatasetCompactingService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
