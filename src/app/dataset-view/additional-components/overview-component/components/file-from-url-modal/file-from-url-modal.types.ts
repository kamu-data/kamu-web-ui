/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";

export interface FileUrlFormType {
    fileUrl: FormControl<MaybeNull<string>>;
}
