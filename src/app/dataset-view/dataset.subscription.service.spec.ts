import { TestBed } from "@angular/core/testing";

import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";

describe("DatasetSubscriptionsService", () => {
    let service: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DatasetSubscriptionsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
