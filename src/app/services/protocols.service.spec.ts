import { TestBed } from "@angular/core/testing";
import { ProtocolsService } from "./protocols.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("ProtocolsService", () => {
    let service: ProtocolsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(ProtocolsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
