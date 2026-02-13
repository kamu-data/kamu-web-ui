/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import {
    MenuActionData,
    SearchAdditionalHeaderButtonInterface,
    SearchAdditionalHeaderButtonMenuAction,
} from "./search-additional-buttons.interface";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { BaseComponent } from "../base.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "../../directives/feature-flag.directive";
import { NgFor, NgIf } from "@angular/common";

@Component({
    selector: "app-search-additional-buttons-nav",
    templateUrl: "./search-additional-buttons-nav.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        //-----//
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        //-----//
        FeatureFlagDirective,
    ],
})
export class SearchAdditionalButtonsNavComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true })
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<SearchAdditionalButtonsEnum>();
    @Output() public searchAdditionalButtonsMenuOpen = new EventEmitter<SearchAdditionalButtonsEnum>();
    @Output() public searchAdditionalButtonsMenuClose = new EventEmitter<SearchAdditionalButtonsEnum>();
    @Output() public searchAdditionalButtonsMenuItemClick = new EventEmitter<MenuActionData>();

    @Input({ required: true }) public loadingListDownsreams: boolean;

    public onClickButton(method: SearchAdditionalButtonsEnum): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }

    public onClickMenuItem(action: SearchAdditionalHeaderButtonMenuAction, value: string): void {
        this.searchAdditionalButtonsMenuItemClick.emit({ action, value });
    }

    public menuOpened(value: SearchAdditionalButtonsEnum): void {
        this.searchAdditionalButtonsMenuOpen.emit(value);
    }

    public menuClosed(value: SearchAdditionalButtonsEnum): void {
        this.searchAdditionalButtonsMenuClose.emit(value);
    }
}
