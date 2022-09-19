import { ModalService } from "./../components/modal/modal.service";
import { TestBed } from "@angular/core/testing";

import { ErrorService } from "./error.service";

describe("ErrorService", () => {
    let service: ErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ModalService],
        });
        service = TestBed.inject(ErrorService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });
});
