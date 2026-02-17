/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

import { catchError, from, of, take } from "rxjs";

import {
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    PageBasedInfo,
    ViewDatasetEnvVar,
    ViewDatasetEnvVarConnection,
} from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch, requireValue } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

import { PaginationComponent } from "../../../../../common/components/pagination-component/pagination.component";
import { SettingsTabsEnum } from "../../dataset-settings.model";
import { EditKeyValueModalComponent } from "./components/edit-key-value-modal/edit-key-value-modal.component";
import { DatasetEnvironmentVariablesService } from "./dataset-environment-variables.service";

export interface EnvVariableElement {
    key: string;
    value: string;
    secret?: boolean;
}

@Component({
    selector: "app-dataset-settings-secrets-manager-tab",
    templateUrl: "./dataset-settings-secrets-manager-tab.component.html",
    styleUrls: ["./dataset-settings-secrets-manager-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        //-----//
        MatDividerModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        //-----//
        PaginationComponent,
    ],
})
export class DatasetSettingsSecretsManagerTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_VARIABLES_AND_SECRETS_KEY)
    public variablesAndSecretsTabData: DatasetViewData;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public readonly DISPLAY_COLUMNS: string[] = ["key", "value", "actions"];
    public dataSource = new MatTableDataSource();
    @ViewChild(MatSort) private sort: MatSort;
    public pageBasedInfo: PageBasedInfo;
    public readonly PER_PAGE = 2;
    public searchByKey = "";
    public currentPage: number = 1;

    private ngbModalService = inject(NgbModal);
    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);
    private environmentVariablesService = inject(DatasetEnvironmentVariablesService);

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.updateTable(this.currentPage);
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.variablesAndSecretsTabData.datasetBasics;
    }

    public get datasetPermissions(): DatasetPermissionsFragment {
        return this.variablesAndSecretsTabData.datasetPermissions;
    }

    public get allowUpdateEnvVars(): boolean {
        return this.datasetPermissions.permissions.envVars.canUpdate;
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public onAddOrEditRow(envVar?: ViewDatasetEnvVar): void {
        const modalRef = this.ngbModalService.open(EditKeyValueModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditKeyValueModalComponent;
        modalRefInstance.datasetBasics = this.datasetBasics;
        modalRefInstance.keyValueForm.reset();
        if (envVar) {
            modalRefInstance.row = envVar;
        }
        from(modalRef.result)
            .pipe(
                take(1),
                catchError(() => of(null)),
            )
            .subscribe((result: string) => {
                if (result === "Success") {
                    this.updateTable(this.currentPage);
                }
            });
    }

    public applyFilter(search: string): void {
        this.dataSource.filterPredicate = (data: unknown, filter: string): boolean => {
            return (data as ViewDatasetEnvVar).key.toLowerCase().includes(filter.trim().toLowerCase());
        };
        this.dataSource.filter = search.trim().toLowerCase();
    }

    public refreshSearchByKey(): void {
        this.searchByKey = "";
        this.dataSource.filter = "";
    }

    public onDelete(datasetEnvVarId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: "Do you want to delete a variable?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.environmentVariablesService
                            .deleteEnvVariable({
                                accountId: this.datasetBasics.owner.id,
                                datasetId: this.datasetBasics.id,
                                datasetEnvVarId,
                            })
                            .subscribe(() => {
                                this.updateTable(this.currentPage);
                            });
                    }
                },
            }),
        );
    }

    private updateTable(page: number): void {
        this.environmentVariablesService
            .listEnvVariables({
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                page: page - 1,
                perPage: this.PER_PAGE,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result: ViewDatasetEnvVarConnection) => {
                this.dataSource.data = result.nodes;
                this.dataSource.sort = this.sort;
                this.pageBasedInfo = result.pageInfo;
            });
    }

    public onPageChange(page: number): void {
        this.currentPage = page;
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetInfo.accountName,
            datasetName: this.datasetInfo.datasetName,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.VARIABLES_AND_SECRETS,
            page: this.currentPage,
        });
        this.updateTable(this.currentPage);
    }
}
