import { TestBed } from "@angular/core/testing";
import { ProcessFormService } from "./process-form.service";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

describe("ProcessFormService", () => {
    let service: ProcessFormService;
    const formGroup = new FormGroup({
        fetch: new FormGroup({
            order: new FormControl("none"),
        }),
        read: new FormGroup({
            kind: new FormControl("csv"),
            schema: new FormArray([]),
        }),
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessFormService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check transform form", () => {
        const transformFormSpy = spyOn(
            service,
            "transformForm",
        ).and.callThrough();
        service.transformForm(formGroup);
        expect(transformFormSpy).toHaveBeenCalledTimes(1);
    });
});
