import { ApolloTestingModule } from "apollo-angular/testing";
import { TestBed } from "@angular/core/testing";
import { EditSetTransformService } from "./edit-set-transform..service";
import { Apollo, ApolloModule } from "apollo-angular";

describe("EditSetTransformService", () => {
    let service: EditSetTransformService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EditSetTransformService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
