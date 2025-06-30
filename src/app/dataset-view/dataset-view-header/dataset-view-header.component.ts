/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import {
    MenuActionData,
    SearchAdditionalHeaderButtonInterface,
    SearchAdditionalHeaderButtonMenuAction,
} from "../../common/components/search-additional-buttons/search-additional-buttons.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS } from "./dataset-view-header.model";
import { DatasetService } from "../dataset.service";
import { finalize, map, Observable } from "rxjs";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseComponent } from "src/app/common/components/base.component";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { AsyncPipe } from "@angular/common";
import { SearchAdditionalButtonsComponent } from "../../common/components/search-additional-buttons/search-additional-buttons.component";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { FeatureFlagDirective } from "../../common/directives/feature-flag.directive";
import { DatasetVisibilityComponent } from "../../common/components/dataset-visibility/dataset-visibility.component";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-dataset-view-header",
    templateUrl: "./dataset-view-header.component.html",
    styleUrls: ["./dataset-view-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatIconModule,
        RouterLink,
        DatasetVisibilityComponent,
        FeatureFlagDirective,
        NgbPopover,
        SearchAdditionalButtonsComponent,
        AsyncPipe,
    ],
})
export class DatasetViewHeaderComponent extends BaseComponent {
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    private datasetService = inject(DatasetService);
    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);
    private cdr = inject(ChangeDetectorRef);

    public loadingListDownsreams = false;

    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[] = [
        ...SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS,
    ];

    public get searchAdditionalButtonsData$(): Observable<SearchAdditionalHeaderButtonInterface[]> {
        return this.datasetService.downstreamsCountChanges.pipe(
            map((counter) => {
                const item = this.searchAdditionalButtonsData.find(
                    (option) => option.value === SearchAdditionalButtonsEnum.DeriveFrom,
                );
                if (item) {
                    item.counter = counter;
                }
                return this.searchAdditionalButtonsData;
            }),
        );
    }

    public onClickSearchAdditionalButton(method: SearchAdditionalButtonsEnum) {
        const mapperMethod: {
            [key in SearchAdditionalButtonsEnum]: () => void;
        } = {
            [SearchAdditionalButtonsEnum.DeriveFrom]: () => null,
            [SearchAdditionalButtonsEnum.Starred]: () => this.onClickUnimplemetedButton(),
            [SearchAdditionalButtonsEnum.UnWatch]: () => this.onClickUnimplemetedButton(),
        };
        mapperMethod[method]();
    }

    private onClickUnimplemetedButton(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public onClickSearchAdditionalButtonsMenuOpen(value: SearchAdditionalButtonsEnum): void {
        const mapperMethod: {
            [key in SearchAdditionalButtonsEnum]: () => void;
        } = {
            [SearchAdditionalButtonsEnum.DeriveFrom]: () => this.openDeriveFromMenu(value),
            [SearchAdditionalButtonsEnum.Starred]: () => null,
            [SearchAdditionalButtonsEnum.UnWatch]: () => null,
        };
        mapperMethod[value]();
    }

    public onCloseSearchAdditionalButtonsMenu(value: SearchAdditionalButtonsEnum): void {
        const mapperMethod: {
            [key in SearchAdditionalButtonsEnum]: () => void;
        } = {
            [SearchAdditionalButtonsEnum.DeriveFrom]: () => this.closeDeriveFromMenu(value),
            [SearchAdditionalButtonsEnum.Starred]: () => null,
            [SearchAdditionalButtonsEnum.UnWatch]: () => null,
        };
        mapperMethod[value]();
    }

    public onClickSearchAdditionalButtonsMenuItem(data: MenuActionData): void {
        const mapperAction: {
            [key in SearchAdditionalHeaderButtonMenuAction]: () => void;
        } = {
            [SearchAdditionalHeaderButtonMenuAction.NavigateToDataset]: () => this.navigateToDataset(data.value),
            [SearchAdditionalHeaderButtonMenuAction.CreateDataset]: () => this.onClickUnimplemetedButton(),
            [SearchAdditionalHeaderButtonMenuAction.SetNotificationsMode]: () => null,
        };
        mapperAction[data.action]();
    }

    private navigateToDataset(alias: string): void {
        const [accountName, datasetName] = alias.split("/");
        this.navigationService.navigateToDatasetView({
            accountName,
            datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    private closeDeriveFromMenu(value: SearchAdditionalButtonsEnum): void {
        const menuItem = this.searchAdditionalButtonsData.find((item) => item.value === value);
        if (menuItem && menuItem.value === SearchAdditionalButtonsEnum.DeriveFrom) {
            menuItem.additionalOptions.options.splice(0, menuItem.additionalOptions.options.length - 1);
        }
    }

    private openDeriveFromMenu(value: SearchAdditionalButtonsEnum): void {
        const menuItem = this.searchAdditionalButtonsData.find((item) => item.value === value);
        if (menuItem) {
            this.loadingListDownsreams = true;
            this.datasetService
                .requestListDownstreams(this.datasetBasics.id)
                .pipe(
                    finalize(() => {
                        this.loadingListDownsreams = false;
                        this.cdr.detectChanges();
                    }),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe((list: string[]) => {
                    const options = list.map((item) => ({
                        title: item,
                        text: "",
                        value: item,
                        isSelected: false,
                        action: SearchAdditionalHeaderButtonMenuAction.NavigateToDataset,
                    }));
                    menuItem.additionalOptions.options = [...options, ...menuItem.additionalOptions.options];
                });
        }
    }
}
