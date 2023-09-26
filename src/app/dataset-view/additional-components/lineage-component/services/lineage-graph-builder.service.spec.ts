import { TestBed } from "@angular/core/testing";

import { LineageGraphBuilderService } from "./lineage-graph-builder.service";

describe("LineageGraphBuilderService", () => {
    let service: LineageGraphBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineageGraphBuilderService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
