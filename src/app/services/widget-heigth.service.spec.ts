import { TestBed } from "@angular/core/testing";

import { WidgetHeightService } from "./widget-heigth.service";

describe("WidgetHeightService", () => {
    let service: WidgetHeightService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WidgetHeightService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
