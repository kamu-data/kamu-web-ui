import { TestBed } from "@angular/core/testing";

import { EditPollingSourceService } from "./edit-polling-source.service";

describe("EditPollingSourceService", () => {
    let service: EditPollingSourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditPollingSourceService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
