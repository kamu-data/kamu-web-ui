/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "src/app/interface/app.types";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { SettingsTabsEnum } from "../../../dataset-settings.model";
import { MatTableDataSource } from "@angular/material/table";
import { BaseComponent } from "src/app/common/components/base.component";
import { promiseWithCatch, requireValue } from "src/app/common/helpers/app.helpers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddPeopleModalComponent } from "./add-people-modal/add-people-modal.component";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { SelectionModel } from "@angular/cdk/collections";

export interface TestInterface {
    // { user: { id: "0", name: "Bill" }, role: { role: "Editor" } }
    user: {
        id: string;
        name: string;
    };
    role: {
        role: string;
    };
}

@Component({
    selector: "app-dataset-settings-access-tab",
    templateUrl: "./dataset-settings-access-tab.component.html",
    styleUrls: ["./dataset-settings-access-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsAccessTabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    public pageBasedInfo: PageBasedInfo;
    public readonly PER_PAGE = 15;
    public searchMember = "";
    public selection = new SelectionModel<TestInterface>(true, []);

    public readonly DISPLAY_COLUMNS: string[] = ["user", "role", "actions"];
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;

    private navigationService = inject(NavigationService);
    private ngbModalService = inject(NgbModal);
    private modalService = inject(ModalService);

    public get isPrivate(): boolean {
        return this.datasetBasics.visibility.__typename === "PrivateDatasetVisibility";
    }

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.dataSource.data = [
            { user: { id: "0", name: "Bill" }, role: { role: "Editor" } },
            { user: { id: "0", name: "John" }, role: { role: "Editor" } },
        ];
        this.pageBasedInfo = {
            currentPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 1,
        };
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public onPageChange(page: number): void {
        this.currentPage = page;
        this.navigationService.navigateToDatasetView({
            accountName: this.getDatasetInfoFromUrl().accountName,
            datasetName: this.getDatasetInfoFromUrl().datasetName,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.VARIABLES_AND_SECRETS,
            page: this.currentPage,
        });
    }

    public addEditPeople(member: MaybeNull<unknown>): void {
        const modalRef = this.ngbModalService.open(AddPeopleModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddPeopleModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
        modalRefInstance.member = member;
    }

    public removeMember(name: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Remove member",
                message: `Do you want to remove ${name}?`,

                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        //TODO: Implement real API
                    }
                },
            }),
        );
    }

    public removeAllMember(): void {
        this.dataSource.data = [];
        promiseWithCatch(
            this.modalService.error({
                title: "Remove member",
                message: `Do you want to remove all member?`,

                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        //TODO: Implement real API
                    }
                },
            }),
        );
    }

    public applyFilter(search: string): void {
        this.dataSource.filterPredicate = (data: unknown, filter: string): boolean => {
            return (data as TestInterface).user.name.toLowerCase().includes(filter.trim().toLowerCase());
        };
        this.dataSource.filter = search.trim().toLowerCase();
    }

    public isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    public masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row as TestInterface));
    }

    public logSelection(): void {
        console.log(
            "==>",
            this.selection.selected.map((s: TestInterface) => s.user.name),
        );
    }
}
