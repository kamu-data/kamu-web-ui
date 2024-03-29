import { TestBed } from "@angular/core/testing";
import { WidgetHeightService } from "./widget-height.service";

describe("WidgetHeightService", () => {
    let service: WidgetHeightService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WidgetHeightService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check widget height", () => {
        const mockOffsetTop = 100;
        const result = 840;
        spyOnProperty(window, "innerHeight").and.returnValue(1000);
        service.setWidgetOffsetTop(mockOffsetTop);
        expect(service.widgetHeight).toEqual(result);
    });
});
