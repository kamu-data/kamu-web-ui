/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { changeCopyIcon } from "src/app/common/helpers/app.helpers";
import { Clipboard } from "@angular/cdk/clipboard";

export abstract class DataAccessBaseTabComponent {
    protected clipboard = inject(Clipboard);

    protected copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }
}
