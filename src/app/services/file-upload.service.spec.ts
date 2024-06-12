import { TestBed } from "@angular/core/testing";
import { FileUploadService } from "./file-upload.service";
import { HttpClientModule } from "@angular/common/http";
import { Apollo } from "apollo-angular";

describe("FileUploadService", () => {
    let service: FileUploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [Apollo],
        });
        service = TestBed.inject(FileUploadService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
