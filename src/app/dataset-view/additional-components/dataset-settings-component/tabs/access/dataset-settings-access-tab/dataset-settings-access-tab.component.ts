/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SelectionModel } from "@angular/cdk/collections";
import { NgIf, TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { NavigationEnd, Router, RouterLink } from "@angular/router";

import { catchError, filter, firstValueFrom, from, map, of, switchMap, take } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch, requireValue } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
    AccountWithRole,
    DatasetAccessRole,
    DatasetBasicsFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

import { PaginationComponent } from "../../../../../../common/components/pagination-component/pagination.component";
import { SettingsTabsEnum } from "../../../dataset-settings.model";
import { AddPeopleModalComponent } from "./add-people-modal/add-people-modal.component";
import { CollaboratorModalResultType } from "./add-people-modal/add-people-modal.model";
import { DatasetCollaborationsService } from "./dataset-collaborations.service";
import { EditCollaboratorModalComponent } from "./edit-collaborator-modal/edit-collaborator-modal.component";

@Component({
    selector: "app-dataset-settings-access-tab",
    templateUrl: "./dataset-settings-access-tab.component.html",
    styleUrls: ["./dataset-settings-access-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        TitleCasePipe,
        RouterLink,
        //-----//
        MatIconModule,
        MatCheckboxModule,
        MatTableModule,
        //-----//
        PaginationComponent,
    ],
})
export class DatasetSettingsAccessTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_ACCESS_KEY) public accessViewData: DatasetViewData;

    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    public pageBasedInfo: PageBasedInfo;
    public readonly PER_PAGE = 15;
    public searchMember = "";
    public selection = new SelectionModel<AccountWithRole>(true, []);

    public readonly DISPLAY_COLUMNS: string[] = ["user", "role", "actions"];
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    private navigationService = inject(NavigationService);
    private ngbModalService = inject(NgbModal);
    private modalService = inject(ModalService);
    private datasetCollaborationsService = inject(DatasetCollaborationsService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private loggedUserService = inject(LoggedUserService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.accessViewData.datasetBasics;
    }

    public get isPrivate(): boolean {
        return this.datasetBasics.visibility.__typename === "PrivateDatasetVisibility";
    }

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.updateTable(this.currentPage);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.updateTable(this.currentPage);
            });
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
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.ACCESS,
            page: this.currentPage,
        });
    }

    public async addPeople(): Promise<void> {
        const activeCollaboratorsIds$ = this.datasetCollaborationsService
            .listCollaborators({ datasetId: this.datasetBasics.id })
            .pipe(
                map((result) => result.nodes.map((node) => node.account.id)),
                takeUntilDestroyed(this.destroyRef),
            );
        const activeCollaboratorsIds = await firstValueFrom(activeCollaboratorsIds$);

        const modalRef = this.ngbModalService.open(AddPeopleModalComponent);
        const modalRefInstance = modalRef.componentInstance as AddPeopleModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
        modalRefInstance.activeCollaboratorsIds = [
            this.loggedUserService.currentlyLoggedInUser.id,
            ...activeCollaboratorsIds,
        ];
        from(modalRef.result)
            .pipe(
                filter((data) => !!data),
                switchMap((result: CollaboratorModalResultType) =>
                    this.datasetCollaborationsService.setRoleCollaborator({
                        datasetId: this.datasetBasics.id,
                        accountId: result.accountId,
                        role: result.role,
                    }),
                ),
                take(1),
                catchError(() => of(null)),
            )
            .subscribe(() => {
                this.selection.clear();
                this.updateTable(this.currentPage);
            });
    }

    public editCollaborator(collaborator: AccountWithRole): void {
        const modalRef = this.ngbModalService.open(EditCollaboratorModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditCollaboratorModalComponent;
        modalRefInstance.collaborator = collaborator;
        from(modalRef.result)
            .pipe(
                filter((data) => !!data),
                switchMap((result: CollaboratorModalResultType) =>
                    this.datasetCollaborationsService.setRoleCollaborator({
                        datasetId: this.datasetBasics.id,
                        accountId: result.accountId,
                        role: result.role,
                    }),
                ),
                take(1),
                catchError(() => of(null)),
            )
            .subscribe(() => {
                this.selection.clear();
                this.updateTable(this.currentPage);
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

    public removeAllMembers(): void {
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

    public setRoleIcon(row: AccountWithRole): string {
        switch (row.role) {
            case DatasetAccessRole.Reader:
                return "library_books";
            case DatasetAccessRole.Editor:
                return "edit_document";
            case DatasetAccessRole.Maintainer:
                return "manage_accounts";
            /* istanbul ignore next */
            default:
                return "";
        }
    }
}
