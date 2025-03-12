/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "src/app/interface/app.types";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { AccountWithRole, DatasetBasicsFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
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
import { DatasetCollaborationsService } from "./dataset-collaborations.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { from } from "rxjs";

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
    public selection = new SelectionModel<AccountWithRole>(true, []);

    public readonly DISPLAY_COLUMNS: string[] = ["user", "role", "actions"];
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;

    private navigationService = inject(NavigationService);
    private ngbModalService = inject(NgbModal);
    private modalService = inject(ModalService);
    private datasetCollaborationsService = inject(DatasetCollaborationsService);
    private cdr = inject(ChangeDetectorRef);

    public get isPrivate(): boolean {
        return this.datasetBasics.visibility.__typename === "PrivateDatasetVisibility";
    }

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.updateTable(this.currentPage);
    }

    private updateTable(page: number): void {
        this.datasetCollaborationsService
            .listCollaborators({
                datasetId: this.datasetBasics.id,
                page: page - 1,
                perPage: this.PER_PAGE,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.dataSource.data = result.nodes;
                this.pageBasedInfo = result.pageInfo;
                this.cdr.detectChanges();
            });
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

    public addEditPeople(collaborator: MaybeNull<AccountWithRole>): void {
        const modalRef = this.ngbModalService.open(AddPeopleModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddPeopleModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
        modalRefInstance.collaborator = collaborator;
        modalRefInstance.currentPage = this.currentPage;
        from(modalRef.result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result: string) => {
                if (result === "Success") {
                    this.selection.clear();
                    this.updateTable(this.currentPage);
                }
            });
    }

    public removeCollaborator(collaborator: AccountWithRole): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Remove collaborator",
                message: `Do you want to remove ${collaborator.account.accountName}?`,

                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.datasetCollaborationsService
                            .unsetRoleCollaborator({
                                datasetId: this.datasetBasics.id,
                                accountIds: [collaborator.account.id],
                            })
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(() => {
                                this.selection.clear();
                                this.updateTable(this.currentPage);
                            });
                    }
                },
            }),
        );
    }

    public removeAllMember(): void {
        const selectedCollaboratorsIds = this.selection.selected.map((s: AccountWithRole) => s.account.id);
        promiseWithCatch(
            this.modalService.error({
                title: "Remove collaborators",
                message: `Do you want to remove selected collaborators?`,
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.datasetCollaborationsService
                            .unsetRoleCollaborator({
                                datasetId: this.datasetBasics.id,
                                accountIds: [...selectedCollaboratorsIds],
                            })
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(() => {
                                this.selection.clear();
                                this.updateTable(this.currentPage);
                            });
                    }
                },
            }),
        );
    }

    public applyFilter(search: string): void {
        this.dataSource.filterPredicate = (data: unknown, filter: string): boolean => {
            return (data as AccountWithRole).account.accountName.toLowerCase().includes(filter.trim().toLowerCase());
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
            : this.dataSource.data.forEach((row) => this.selection.select(row as AccountWithRole));
    }
}
