import { TestBed } from "@angular/core/testing";

import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";

describe("AppDatasetSubscriptionsService", () => {
    let service: AppDatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppDatasetSubscriptionsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
