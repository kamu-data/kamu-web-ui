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
import { MenuActionData, SearchAdditionalHeaderButtonInterface } from "./search-additional-buttons.interface";
import { isMobileView } from "src/app/common/helpers/app.helpers";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-search-additional-buttons",
    templateUrl: "./search-additional-buttons.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        SearchAdditionalButtonsNavComponent,
    ],
})
export class SearchAdditionalButtonsComponent implements OnInit {
    @Input({ required: true })
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[];
    @Input({ required: true }) public loadingListDownsreams: boolean;
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<SearchAdditionalButtonsEnum>();
    @Output() public searchAdditionalButtonsMenuOpen = new EventEmitter<SearchAdditionalButtonsEnum>();
    @Output() public searchAdditionalButtonsMenuClose = new EventEmitter<SearchAdditionalButtonsEnum>();
    @Output() public searchAdditionalButtonsMenuItemClick = new EventEmitter<MenuActionData>();

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

    public onClick(method: SearchAdditionalButtonsEnum): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }

    public onMenuOpen(value: SearchAdditionalButtonsEnum): void {
        this.searchAdditionalButtonsMenuOpen.emit(value);
    }

    public onMenuClose(value: SearchAdditionalButtonsEnum): void {
        this.searchAdditionalButtonsMenuClose.emit(value);
    }

    public onClickMenuItem(value: MenuActionData): void {
        this.searchAdditionalButtonsMenuItemClick.emit(value);
    }
}
