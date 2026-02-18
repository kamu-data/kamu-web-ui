/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { BaseComponent } from "@common/components/base.component";
import {
    MenuActionData,
    SearchAdditionalHeaderButtonInterface,
    SearchAdditionalHeaderButtonMenuAction,
} from "@common/components/search-additional-buttons/search-additional-buttons.interface";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

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
