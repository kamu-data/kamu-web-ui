/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Component, inject, Input } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastrService } from "ngx-toastr";
import ProjectLinks from "src/app/project-links";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { NgIf, SlicePipe } from "@angular/common";

@Component({
    selector: "app-display-hash",
    templateUrl: "./display-hash.component.html",
    styleUrls: ["./display-hash.component.scss"],
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        MatIconModule,
        SlicePipe,
    ],
})
export class DisplayHashComponent {
    @Input({ required: true }) public value: string;
    @Input() public navigationTargetDataset?: DatasetInfo;
    @Input() public showCopyButton = false;
    @Input() public class = "mr-1 hashBlock";
    public readonly URL_BLOCK = ProjectLinks.URL_BLOCK;

    private clipboard = inject(Clipboard);
    private toastr = inject(ToastrService);

    public copyToClipboard(text: string): void {
        this.clipboard.copy(text);
        this.toastr.success("Copied");
    }
}
