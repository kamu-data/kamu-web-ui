import { TestBed } from "@angular/core/testing";

import { EditPollingSourceService } from "./edit-polling-source.service";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { FormBuilder } from "@angular/forms";

describe("EditPollingSourceService", () => {
    let service: EditPollingSourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, DatasetApi, FormBuilder],
        });
        service = TestBed.inject(EditPollingSourceService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
