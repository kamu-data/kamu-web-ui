/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormArray, FormControl, FormGroup } from "@angular/forms";

import { requireFormArray, requireFormControl, requireFormGroup } from "@common/helpers/form.helpers";

describe("FormHelpers", () => {
    const section = new FormControl("csv");
    const headers = new FormArray([new FormControl("Accept")]);
    const eventTime = new FormGroup({ kind: new FormControl("fromMetadata") });
    const form = new FormGroup({ section, headers, eventTime });

    it("should return each control of the expected kind", () => {
        expect(requireFormControl(form, "section")).toBe(section);
        expect(requireFormArray(form, "headers")).toBe(headers);
        expect(requireFormGroup(form, "eventTime")).toBe(eventTime);
    });

    it("should throw when a control is of another kind", () => {
        expect(() => requireFormArray(form, "section")).toThrowError(
            'Expecting form control "section" to be a FormArray',
        );
        expect(() => requireFormGroup(form, "headers")).toThrowError(
            'Expecting form control "headers" to be a FormGroup',
        );
        expect(() => requireFormControl(form, "eventTime")).toThrowError(
            'Expecting form control "eventTime" to be a FormControl',
        );
    });

    it("should throw when a control is missing", () => {
        expect(() => requireFormGroup(form, "merge")).toThrowError('Expecting form control "merge" to be a FormGroup');
    });
});
