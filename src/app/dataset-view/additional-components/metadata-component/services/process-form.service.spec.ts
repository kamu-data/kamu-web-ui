/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

import {
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    PrepareKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SchemaControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { ProcessFormService } from "src/app/dataset-view/additional-components/metadata-component/services/process-form.service";

describe("ProcessFormService", () => {
    let service: ProcessFormService;
    const formGroup = new FormGroup({
        fetch: new FormGroup({
            order: new FormControl("NONE"),
            eventTime: new FormGroup({
                kind: new FormControl(EventTimeSourceKind.FROM_METADATA),
                timestampFormat: new FormControl(""),
            }),
            cache: new FormControl(false),
        }),
        read: new FormGroup({
            kind: new FormControl(ReadKind.CSV),
            schema: new FormArray([
                new FormGroup({
                    name: new FormControl("id"),
                    type: new FormControl("BIGINT"),
                }),
            ]),
        }),
        merge: new FormGroup({
            kind: new FormControl(MergeKind.APPEND),
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
                eventTime: { kind: EventTimeSourceKind.FROM_METADATA, timestampFormat: "" },
                cache: false,
            },
            read: { kind: ReadKind.CSV, schema: [{ name: "id", type: "BIGINT" }] },
            merge: { kind: MergeKind.APPEND },
        };
        const expectedResult = {
            fetch: { eventTime: { kind: EventTimeSourceKind.FROM_METADATA } },
            read: { kind: ReadKind.CSV, schema: ["id BIGINT"] },
            merge: { kind: MergeKind.APPEND },
        };
        expect(formGroup.value).toEqual(initialResult);
        service.transformForm(formGroup);
        expect(transformFormSpy).toHaveBeenCalledTimes(1);
        expect(formGroup.value as SchemaControlType).toEqual(expectedResult);
    });

    it("should check remove eventTime when fetch type is container ", () => {
        const formGroupFetchContainer = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl(FetchKind.CONTAINER),
                eventTime: new FormGroup({
                    kind: new FormControl(EventTimeSourceKind.FROM_METADATA),
                    timestampFormat: new FormControl(""),
                }),
            }),
            read: new FormGroup({
                kind: new FormControl(ReadKind.CSV),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id (A.M.)"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl(MergeKind.APPEND),
            }),
        });

        const initialResult = {
            fetch: {
                kind: FetchKind.CONTAINER,
                eventTime: { kind: EventTimeSourceKind.FROM_METADATA, timestampFormat: "" },
            },
            read: {
                kind: ReadKind.CSV,
                schema: [{ name: "id (A.M.)", type: "BIGINT" }],
            },
            merge: { kind: MergeKind.APPEND },
        };
        const expectedResult = {
            fetch: { kind: FetchKind.CONTAINER },
            read: { kind: ReadKind.CSV, schema: ["`id (A.M.)` BIGINT"] },
            merge: { kind: MergeKind.APPEND },
        };
        expect(formGroupFetchContainer.value).toEqual(initialResult);
        service.transformForm(formGroupFetchContainer);

        expect(formGroupFetchContainer.value as SchemaControlType).toEqual(expectedResult);
    });

    it("should check parse command correct on the PREPARE step. ", () => {
        const formGroupFetchContainer = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl(FetchKind.CONTAINER),
                eventTime: new FormGroup({
                    kind: new FormControl(EventTimeSourceKind.FROM_METADATA),
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
                kind: new FormControl(ReadKind.CSV),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id (A.M.)"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl(MergeKind.APPEND),
            }),
        });

        const expectedResult = {
            fetch: { kind: FetchKind.CONTAINER },
            read: { kind: ReadKind.CSV, schema: ["`id (A.M.)` BIGINT"] },
            prepare: [{ kind: PrepareKind.PIPE, command: ["i", "-c", "'1,/OBSERVATION/d'"] }],
            merge: { kind: MergeKind.APPEND },
        };
        service.transformForm(formGroupFetchContainer);

        expect(formGroupFetchContainer.value as SchemaControlType).toEqual(expectedResult);
    });
});
