import { TestBed } from "@angular/core/testing";
import { DatasetFlowsService } from "./dataset-flows.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("DatasetFlowsService", () => {
    let service: DatasetFlowsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetFlowsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});