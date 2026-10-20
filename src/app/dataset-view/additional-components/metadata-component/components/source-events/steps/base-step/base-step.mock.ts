/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormArray, FormBuilder, FormControl, FormGroupDirective } from "@angular/forms";

import { FetchKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export function createSourceEventFormGroupDirective(): FormGroupDirective {
    const fb = new FormBuilder();
    const directive = new FormGroupDirective([], []);
    directive.form = fb.group({
        fetch: fb.group({
            kind: new FormControl(FetchKind.URL),
        }),
        prepare: new FormArray([]),
    });
    return directive;
}
