/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

import { catchError, from, of, take } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { PagePastEndComponent } from "@common/components/page-past-end/page-past-end.component";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { openModal } from "@common/helpers/modal.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import {
    DatasetBasicsFragment,
    DatasetPageInfoFragment,
    DatasetPermissionsFragment,
    ViewDatasetEnvVarConnectionDataFragment,
    ViewDatasetEnvVarDataFragment,
} from "@api/kamu.graphql.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { EditKeyValueModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/components/edit-key-value-modal/edit-key-value-modal.component";
import { DatasetEnvironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-environment-variables.service";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

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
        //-----//
        MatDividerModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        //-----//
        PaginationComponent,
        PagePastEndComponent,
    ],
})
export class DatasetSettingsSecretsManagerTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_VARIABLES_AND_SECRETS_KEY)
    public variablesAndSecretsTabData: DatasetViewData;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public readonly DISPLAY_COLUMNS: string[] = ["key", "value", "actions"];
    public dataSource = new MatTableDataSource<ViewDatasetEnvVarDataFragment>();
    @ViewChild(MatSort) private sort: MatSort;
    public pageBasedInfo: DatasetPageInfoFragment;
    public readonly PER_PAGE = 15;
    public searchByKey = "";
    public currentPage: number = 1;

    private ngbModalService = inject(NgbModal);
    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);
    private environmentVariablesService = inject(DatasetEnvironmentVariablesService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.currentPage = this.pageFromUrl() ?? this.currentPage;
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

    public onAddOrEditRow(envVar?: ViewDatasetEnvVarDataFragment): void {
        const { modalRef, instance } = openModal(this.ngbModalService, EditKeyValueModalComponent);
        instance.datasetBasics = this.datasetBasics;
        instance.keyValueForm.reset();
        if (envVar) {
            instance.row = envVar;
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
        this.dataSource.filterPredicate = (data: ViewDatasetEnvVarDataFragment, filter: string): boolean => {
            return data.key.toLowerCase().includes(filter.trim().toLowerCase());
        };
        this.dataSource.filter = search.trim().toLowerCase();
    }

    public refreshSearchByKey(): void {
        this.searchByKey = "";
        this.dataSource.filter = "";
    }

    public onDelete(datasetEnvVarKey: string): void {
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
                                datasetEnvVarKey,
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
            .subscribe((result: ViewDatasetEnvVarConnectionDataFragment) => {
                this.dataSource.data = result.nodes;
                this.dataSource.sort = this.sort;
                this.pageBasedInfo = result.pageInfo;
                this.cdr.markForCheck();
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
