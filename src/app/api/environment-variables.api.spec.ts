import { TestBed } from "@angular/core/testing";

import { EnvironmentVariablesApi } from "./environment-variables.api";

describe("EnvironmentVariablesApi", () => {
    let service: EnvironmentVariablesApi;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EnvironmentVariablesApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
