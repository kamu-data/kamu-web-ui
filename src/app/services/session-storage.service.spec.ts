import { TestBed } from "@angular/core/testing";
import { SessionStorageService } from "./session-storage.service";

describe("SessionStorageService", () => {
    let service: SessionStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SessionStorageService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be check set state for side panel", () => {
        service.setSidePanelVisible(true);
        expect(service.isSidePanelVisible).toBeTrue();
        service.setSidePanelVisible(false);
        expect(service.isSidePanelVisible).toBeFalse();
    });
});
