/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { EditKeyValueModalComponent } from "./components/edit-key-value-modal/edit-key-value-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch, requireValue } from "src/app/common/helpers/app.helpers";
import {
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    PageBasedInfo,
    ViewDatasetEnvVar,
    ViewDatasetEnvVarConnection,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import ProjectLinks from "src/app/project-links";
import { DatasetEvnironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-evnironment-variables.service";
import { from } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { SettingsTabsEnum } from "../../dataset-settings.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetPermissionsService } from "src/app/dataset-view/dataset.permissions.service";

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
})
export class DatasetSettingsSecretsManagerTabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;
    public readonly DISPLAY_COLUMNS: string[] = ["key", "value", "actions"];
    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    @ViewChild(MatSort) private sort: MatSort;
    public pageBasedInfo: PageBasedInfo;
    public readonly PER_PAGE = 15;
    public searchByKey = "";

    private ngbModalService = inject(NgbModal);
    private modalService = inject(ModalService);
    private evnironmentVariablesService = inject(DatasetEvnironmentVariablesService);
    private navigationService = inject(NavigationService);
    private datasetPermissionsService = inject(DatasetPermissionsService);

    public ngOnInit(): void {
        this.getPageFromUrl();
        this.updateTable(this.currentPage);
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
            .pipe(takeUntilDestroyed(this.destroyRef))
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
                        this.evnironmentVariablesService
                            .deleteEnvVariable({
                                accountId: this.datasetBasics.owner.id,
                                datasetId: this.datasetBasics.id,
                                datasetEnvVarId,
                            })
                            .subscribe(() => this.updateTable(this.currentPage));
                    }
                },
            }),
        );
    }

    private updateTable(page: number): void {
        this.evnironmentVariablesService
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
            accountName: this.getDatasetInfoFromUrl().accountName,
            datasetName: this.getDatasetInfoFromUrl().datasetName,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.VARIABLES_AND_SECRETS,
            page: this.currentPage,
        });
        this.updateTable(this.currentPage);
    }
}
