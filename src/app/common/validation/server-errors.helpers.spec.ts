/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, Validators } from "@angular/forms";

import { setServerError } from "@common/validation/server-errors.helpers";

describe("setServerError", () => {
    it("should add the server error beside the control's own errors and mark it touched", () => {
        const control = new FormControl("", [Validators.required]);

        setServerError(control, "Name is taken");

        expect(control.errors).toEqual({ required: true, server: { message: "Name is taken" } });
        expect(control.touched).toBe(true);
    });

    it("should be cleared by the next value change", () => {
        const control = new FormControl("taken");
        setServerError(control, "Name is taken");

        control.setValue("free");

        expect(control.errors).toBeNull();
    });
});
