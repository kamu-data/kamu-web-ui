import { TestBed } from "@angular/core/testing";
import { AdminGuard } from "./admin.guard";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AdminGuard", () => {
    let guard: AdminGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule, HttpClientTestingModule],
        });
        guard = TestBed.inject(AdminGuard);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });
});
