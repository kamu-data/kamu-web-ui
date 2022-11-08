import { TestBed } from "@angular/core/testing";

import { AuthentificationGuard } from "./authentification.guard";

describe("AuthentificationGuard", () => {
    let guard: AuthentificationGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        guard = TestBed.inject(AuthentificationGuard);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });
});
