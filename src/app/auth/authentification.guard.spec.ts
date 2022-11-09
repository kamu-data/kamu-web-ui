import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";

import { AuthentificationGuard } from "./authentification.guard";

describe("AuthentificationGuard", () => {
    let guard: AuthentificationGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        guard = TestBed.inject(AuthentificationGuard);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });
});
