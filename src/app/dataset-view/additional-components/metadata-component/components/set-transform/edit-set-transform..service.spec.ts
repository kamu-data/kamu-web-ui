import { TestBed } from "@angular/core/testing";

import { EditSetTransformService } from "./edit-set-transform..service";

describe("EditSetTransformService", () => {
    let service: EditSetTransformService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditSetTransformService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
