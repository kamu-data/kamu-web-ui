import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { overviewTabQueryParamsResolverFn } from "./overview-tab-query-params.resolver";

describe("overviewTabQueryParamsResolver", () => {
    const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => overviewTabQueryParamsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
