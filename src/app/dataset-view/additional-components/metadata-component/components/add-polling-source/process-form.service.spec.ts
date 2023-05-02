import { TestBed } from "@angular/core/testing";
import { ProcessFormService } from "./process-form.service";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { SchemaControlType } from "./process-form.service.types";

describe("ProcessFormService", () => {
    let service: ProcessFormService;
    const formGroup = new FormGroup({
        fetch: new FormGroup({
            order: new FormControl("none"),
        }),
        read: new FormGroup({
            kind: new FormControl("csv"),
            schema: new FormArray([
                new FormGroup({
                    name: new FormControl("id"),
                    type: new FormControl("BIGINT"),
                }),
            ]),
        }),
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessFormService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check transform form is call", () => {
        const transformFormSpy = spyOn(
            service,
            "transformForm",
        ).and.callThrough();
        const initialResult = {
            fetch: { order: "none" },
            read: { kind: "csv", schema: [{ name: "id", type: "BIGINT" }] },
        };
        const expectedResult = {
            fetch: {},
            read: { kind: "csv", schema: ["id BIGINT"] },
        };
        expect(formGroup.value).toEqual(initialResult);

        service.transformForm(formGroup);

        expect(transformFormSpy).toHaveBeenCalledTimes(1);
        expect(formGroup.value as SchemaControlType).toEqual(expectedResult);
    });
});
