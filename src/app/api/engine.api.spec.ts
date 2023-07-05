import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { EngineApi } from "./engine.api";
import { Apollo, ApolloModule } from "apollo-angular";

describe("EngineApi", () => {
    let service: EngineApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EngineApi, Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EngineApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
