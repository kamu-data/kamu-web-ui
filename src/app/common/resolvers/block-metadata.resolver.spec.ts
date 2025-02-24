import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { blockMetadataResolver } from "./block-metadata.resolver";

describe("blockMetadataResolver", () => {
    const executeResolver: ResolveFn<void> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => blockMetadataResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
