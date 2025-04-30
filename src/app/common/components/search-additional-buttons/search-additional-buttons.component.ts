/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { SearchAdditionalHeaderButtonOptions } from "./search-additional-buttons.interface";
import { isMobileView } from "src/app/common/helpers/app.helpers";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-search-additional-buttons",
    templateUrl: "./search-additional-buttons.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAdditionalButtonsComponent implements OnInit {
    @Input({ required: true })
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonOptions;
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<string>();
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public shouldMinimizeSearchAdditionalButtons = false;
    @ViewChild("menuTrigger") public trigger: ElementRef;

    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.shouldMinimizeSearchAdditionalButtons = isMobileView();
    }

    public ngOnInit(): void {
        this.checkWindowSize();
    }

    public onClick(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }
}
