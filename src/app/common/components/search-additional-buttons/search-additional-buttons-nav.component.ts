/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SearchAdditionalHeaderButtonInterface } from "./search-additional-buttons.interface";

@Component({
    selector: "app-search-additional-buttons-nav",
    templateUrl: "./search-additional-buttons-nav.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAdditionalButtonsNavComponent {
    @Input({ required: true })
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<string>();

    public onClickButton(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}
