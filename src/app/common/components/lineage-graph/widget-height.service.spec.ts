/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { WidgetHeightService } from "@common/components/lineage-graph/widget-height.service";

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

    it("should not let the widget shrink below its minimum height", () => {
        spyOnProperty(window, "innerHeight").and.returnValue(300);
        service.setWidgetOffsetTop(100);
        expect(service.widgetHeight).toEqual(200);
    });
});
