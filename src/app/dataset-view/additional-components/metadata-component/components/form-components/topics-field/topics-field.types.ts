/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "../../../../../../interface/app.types";
import { FormControl } from "@angular/forms";

export interface KeyValueFormType {
    path: FormControl<MaybeNull<string>>;
    qos: FormControl<MaybeNull<string>>;
}
