/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { requiredUnlessValidator } from "@common/validation/cross-field.validators";

describe("requiredUnlessValidator", () => {
    function form(chainId: string, nodeUrl: string): FormGroup {
        const group = new FormGroup({
            chainId: new FormControl(chainId, [requiredUnlessValidator("nodeUrl", "Node URL")]),
            nodeUrl: new FormControl(nodeUrl),
        });
        // A control's validators first run before it has a parent; the form revalidates it once it has one.
        group.controls.chainId.updateValueAndValidity();
        return group;
    }

    it("should fail while both fields are empty", () => {
        expect(form("", "").controls.chainId.errors).toEqual({
            format: { message: "is required unless Node URL is set" },
        });
    });

    it("should pass when either field is set", () => {
        expect(form("1", "").controls.chainId.errors).toBeNull();
        expect(form("", "https://node").controls.chainId.errors).toBeNull();
    });

    it("should pass outside a group", () => {
        expect(requiredUnlessValidator("nodeUrl", "Node URL")(new FormControl(""))).toBeNull();
    });
});
