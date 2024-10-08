import { TestBed } from "@angular/core/testing";
import { VisibilityModeService } from "./visibility-mode.service";

describe("VisibilityModeService", () => {
    let service: VisibilityModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VisibilityModeService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
