import { TestBed } from "@angular/core/testing";
import { ProcessFormService } from "./process-form.service";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { SchemaControlType } from "../components/source-events/add-polling-source/process-form.service.types";
import { PrepareKind } from "../components/source-events/add-polling-source/add-polling-source-form.types";

describe("ProcessFormService", () => {
    let service: ProcessFormService;
    const formGroup = new FormGroup({
        fetch: new FormGroup({
            order: new FormControl("NONE"),
            eventTime: new FormGroup({
                kind: new FormControl("fromMetadata"),
                timestampFormat: new FormControl(""),
            }),
            cache: new FormControl(false),
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
        merge: new FormGroup({
            kind: new FormControl("append"),
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
        const transformFormSpy = spyOn(service, "transformForm").and.callThrough();
        const initialResult = {
            fetch: {
                order: "NONE",
                eventTime: { kind: "fromMetadata", timestampFormat: "" },
                cache: false,
            },
            read: { kind: "csv", schema: [{ name: "id", type: "BIGINT" }] },
            merge: { kind: "append" },
        };
        const expectedResult = {
            fetch: { eventTime: { kind: "fromMetadata" } },
            read: { kind: "csv", schema: ["id BIGINT"] },
            merge: { kind: "append" },
        };
        expect(formGroup.value).toEqual(initialResult);
        service.transformForm(formGroup);
        expect(transformFormSpy).toHaveBeenCalledTimes(1);
        expect(formGroup.value as SchemaControlType).toEqual(expectedResult);
    });

    it("should check remove eventTime when fetch type is container ", () => {
        const formGroupFetchContainer = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl("container"),
                eventTime: new FormGroup({
                    kind: new FormControl("fromMetadata"),
                    timestampFormat: new FormControl(""),
                }),
            }),
            read: new FormGroup({
                kind: new FormControl("csv"),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id (A.M.)"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl("append"),
            }),
        });

        const initialResult = {
            fetch: {
                kind: "container",
                eventTime: { kind: "fromMetadata", timestampFormat: "" },
            },
            read: {
                kind: "csv",
                schema: [{ name: "id (A.M.)", type: "BIGINT" }],
            },
            merge: { kind: "append" },
        };
        const expectedResult = {
            fetch: { kind: "container" },
            read: { kind: "csv", schema: ["`id (A.M.)` BIGINT"] },
            merge: { kind: "append" },
        };
        expect(formGroupFetchContainer.value).toEqual(initialResult);
        service.transformForm(formGroupFetchContainer);

        expect(formGroupFetchContainer.value as SchemaControlType).toEqual(expectedResult);
    });

    it("should check parse command correct on the PREPARE step. ", () => {
        const formGroupFetchContainer = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl("container"),
                eventTime: new FormGroup({
                    kind: new FormControl("fromMetadata"),
                    timestampFormat: new FormControl(""),
                }),
            }),
            prepare: new FormArray([
                new FormGroup({
                    kind: new FormControl(PrepareKind.PIPE),
                    command: new FormControl("i -c '1,/OBSERVATION/d'"),
                }),
            ]),
            read: new FormGroup({
                kind: new FormControl("csv"),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id (A.M.)"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl("append"),
            }),
        });

        const expectedResult = {
            fetch: { kind: "container" },
            read: { kind: "csv", schema: ["`id (A.M.)` BIGINT"] },
            prepare: [{ kind: "pipe", command: ["i", "-c", "'1,/OBSERVATION/d'"] }],
            merge: { kind: "append" },
        };
        service.transformForm(formGroupFetchContainer);

        expect(formGroupFetchContainer.value as SchemaControlType).toEqual(expectedResult);
    });
});
