/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MatTableModule } from "@angular/material/table";
import { ToastrModule } from "ngx-toastr";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSecretsManagerTabComponent } from "./dataset-settings-secrets-manager-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { FormBuilder, FormsModule } from "@angular/forms";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetEvnironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-evnironment-variables.service";
import { MOCK_ENV_VAR_ID, mockListEnvVariablesQuery } from "src/app/api/mock/environment-variables-and-secrets.mock";
import { ViewDatasetEnvVarConnection } from "src/app/api/kamu.graphql.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { MOCK_DATASET_INFO } from "../../../metadata-component/components/set-transform/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { SimpleChanges } from "@angular/core";

describe("DatasetSettingsSecretsManagerTabComponent", () => {
    let component: DatasetSettingsSecretsManagerTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSecretsManagerTabComponent>;
    let navigationService: NavigationService;
    let evnironmentVariablesService: DatasetEvnironmentVariablesService;
    let ngbModalService: NgbModal;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsSecretsManagerTabComponent, PaginationComponent],
            providers: [FormBuilder, Apollo],
            imports: [
                ToastrModule.forRoot(),
                ApolloTestingModule,
                MatDividerModule,
                MatTableModule,
                HttpClientModule,
                MatIconModule,
                FormsModule,
                MatTooltipModule,
                SharedTestModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsSecretsManagerTabComponent);
        navigationService = TestBed.inject(NavigationService);
        evnironmentVariablesService = TestBed.inject(DatasetEvnironmentVariablesService);
        ngbModalService = TestBed.inject(NgbModal);
        modalService = TestBed.inject(ModalService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.variablesAndSecretsTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            connection: mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars
                .listEnvVariables as ViewDatasetEnvVarConnection,
        };
        component.datasetInfo = MOCK_DATASET_INFO;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        expect(component.currentPage).toEqual(1);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        component.onPageChange(3);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ page: 3 }));
        expect(component.currentPage).toEqual(3);
    });

    it("should check ngOnChanges", () => {
        const connection = mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars
            .listEnvVariables as ViewDatasetEnvVarConnection;
        const varAndSecretsChanges: SimpleChanges = {
            variablesAndSecretsTabData: {
                previousValue: undefined,
                currentValue: {
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    connection,
                },
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        component.ngOnChanges(varAndSecretsChanges);
        expect(component.dataSource.data).toEqual(connection.nodes);
    });

    it("should check refresh search", () => {
        component.searchByKey = "mock-key";
        component.refreshSearchByKey();
        expect(component.searchByKey).toEqual("");
        expect(component.dataSource.filter).toEqual("");
    });

    it("should check apply filter", () => {
        const testSearch = "Test";
        component.applyFilter(testSearch);
        expect(component.dataSource.filter).toEqual(testSearch.toLowerCase());
    });

    it("should check delete env variable", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const deleteEnvVariableSpy = spyOn(evnironmentVariablesService, "deleteEnvVariable").and.callThrough();
        component.onDelete(MOCK_ENV_VAR_ID);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvVariableSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add env variable", () => {
        const ngbModalServiceOpenSpy = spyOn(ngbModalService, "open").and.callThrough();
        component.onAddOrEditRow();
        expect(ngbModalServiceOpenSpy).toHaveBeenCalledTimes(1);
    });
});
