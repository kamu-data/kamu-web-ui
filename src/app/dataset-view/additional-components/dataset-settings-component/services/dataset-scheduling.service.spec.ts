import { TestBed } from "@angular/core/testing";

import { DatasetSchedulingService } from "./dataset-scheduling.service";

describe("DatasetSchedulingService", () => {
    let service: DatasetSchedulingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetSchedulingService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
