import { TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SchedulingApi } from "./scheduling.api";

describe("SchedulingApi", () => {
    let service: SchedulingApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SchedulingApi, Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(SchedulingApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
