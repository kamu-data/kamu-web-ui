/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Clipboard } from "@angular/cdk/clipboard";
import { SlicePipe } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { MetadataBlockLinkPipe } from "@common/pipes/metadata-block-link.pipe";
import { DatasetInfo } from "@interface/navigation.interface";

@Component({
    selector: "app-display-hash",
    templateUrl: "./display-hash.component.html",
    styleUrls: ["./display-hash.component.scss"],
    imports: [
        //-----//
        RouterLink,
        SlicePipe,
        //-----//
        MatIconModule,
        //-----//
        MetadataBlockLinkPipe,
    ],
})
export class DisplayHashComponent {
    @Input({ required: true }) public value: string;
    @Input() public navigationTargetDataset?: DatasetInfo;
    @Input() public showCopyButton = false;
    @Input() public class = "mr-1 hashBlock";

    private clipboard = inject(Clipboard);
    private toastr = inject(ToastrService);

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastr.success("Copied");
    }
}
