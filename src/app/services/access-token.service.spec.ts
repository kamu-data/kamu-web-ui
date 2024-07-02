import { TestBed } from "@angular/core/testing";
import { AccessTokenService } from "./access-token.service";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";

describe("AccessTokenService", () => {
    let service: AccessTokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot()],
        });
        service = TestBed.inject(AccessTokenService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
