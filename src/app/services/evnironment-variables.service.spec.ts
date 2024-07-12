import { TestBed } from "@angular/core/testing";
import { EvnironmentVariablesService } from "./evnironment-variables.service";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";

describe("EvnironmentVariablesService", () => {
    let service: EvnironmentVariablesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
        });
        service = TestBed.inject(EvnironmentVariablesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
