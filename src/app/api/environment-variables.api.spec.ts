import { TestBed } from "@angular/core/testing";
import { EnvironmentVariablesApi } from "./environment-variables.api";
import { Apollo } from "apollo-angular";

describe("EnvironmentVariablesApi", () => {
    let service: EnvironmentVariablesApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(EnvironmentVariablesApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
