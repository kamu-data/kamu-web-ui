import { TestBed } from "@angular/core/testing";

import { PollingSourceFormService } from "./polling-source-form.service";

describe("PollingSourceFormService", () => {
    let service: PollingSourceFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PollingSourceFormService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
