import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/build/testing";
import { EngineApi } from "./engine.api";

describe("EngineApi", () => {
    let service: EngineApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EngineApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(EngineApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
