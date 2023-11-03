import { TestBed } from "@angular/core/testing";

import { LineageGraphHeigthService } from "./lineage-graph-heigth.service";

describe("LineageGraphHeigthService", () => {
    let service: LineageGraphHeigthService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineageGraphHeigthService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
