import { TestBed } from "@angular/core/testing";
import { DatasetSchedulingService } from "./dataset-scheduling.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";

describe("DatasetSchedulingService", () => {
    let service: DatasetSchedulingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(DatasetSchedulingService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
