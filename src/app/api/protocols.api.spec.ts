import { TestBed } from "@angular/core/testing";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { ProtocolsApi } from "./protocols.api";

describe("ProtocolsApi", () => {
    let service: ProtocolsApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProtocolsApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(ProtocolsApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
