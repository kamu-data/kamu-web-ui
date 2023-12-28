import { TestBed } from "@angular/core/testing";
import { EditAddPushSourceService } from "./edit-add-push-source.service";
import { FormBuilder } from "@angular/forms";
import { Apollo, ApolloModule } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("EditAddPushSourceService", () => {
    let service: EditAddPushSourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, DatasetApi, FormBuilder],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EditAddPushSourceService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
