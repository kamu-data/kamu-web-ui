/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Clipboard } from "@angular/cdk/clipboard";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { changeCopyIcon } from "@common/helpers/app.helpers";

@Component({
    selector: "app-copy-to-clipboard",
    templateUrl: "./copy-to-clipboard.component.html",
    styleUrls: ["./copy-to-clipboard.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule],
})
export class CopyToClipboardComponent {
    @Input({ required: true }) public text: string;
    @Input() public dataTestId: string;

    private clipboard = inject(Clipboard);

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }
}
