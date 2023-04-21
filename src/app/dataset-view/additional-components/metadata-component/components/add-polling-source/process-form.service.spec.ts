import { TestBed } from "@angular/core/testing";

import { ProcessFormService } from "./process-form.service";

describe("ProcessFormService", () => {
    let service: ProcessFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessFormService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
