import { TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetFlowApi } from "./dataset-flow.api";

describe("DatasetFlowApi", () => {
    let service: DatasetFlowApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DatasetFlowApi, Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(DatasetFlowApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
