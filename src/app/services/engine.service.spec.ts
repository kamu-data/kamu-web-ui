import { TestBed } from "@angular/core/testing";
import { EngineService } from "./engine.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("EngineService", () => {
    let service: EngineService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EngineService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
