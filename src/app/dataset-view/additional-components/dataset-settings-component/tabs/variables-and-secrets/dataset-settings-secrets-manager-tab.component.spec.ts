/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { MOCK_VAR_KEY, mockListEnvVariablesQuery } from "@api/mock/environment-variables-and-secrets.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetEnvironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-environment-variables.service";
import { DatasetSettingsSecretsManagerTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-settings-secrets-manager-tab.component";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetSettingsSecretsManagerTabComponent", () => {
    let component: DatasetSettingsSecretsManagerTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSecretsManagerTabComponent>;
    let navigationService: NavigationService;
    let environmentVariablesService: DatasetEnvironmentVariablesService;
    let ngbModalService: NgbModal;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatasetSettingsSecretsManagerTabComponent, ApolloTestingModule],
            providers: [
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_PAGE:
                                            return undefined;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsSecretsManagerTabComponent);
        navigationService = TestBed.inject(NavigationService);
        environmentVariablesService = TestBed.inject(DatasetEnvironmentVariablesService);
        ngbModalService = TestBed.inject(NgbModal);
        modalService = TestBed.inject(ModalService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "variablesAndSecretsTabData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
        setComponentInput(fixture, "datasetInfo", MOCK_DATASET_INFO);
        vi.spyOn(environmentVariablesService, "listEnvVariables").mockReturnValue(
            of(requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables)),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        expect(component.currentPage).toEqual(1);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

        component.onPageChange(3);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
        expect(component.currentPage).toEqual(3);
    });

    it("should say a page past the last one has no variables and lead to the last page", async () => {
        const envVariables = requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables);
        vi.spyOn(environmentVariablesService, "listEnvVariables").mockReturnValue(
            of({ ...structuredClone(envVariables), nodes: [], pageInfo: { ...envVariables.pageInfo, totalPages: 3 } }),
        );
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");
        component.onPageChange(5);
        fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no variables on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToDatasetViewSpy).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3 }));
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
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const deleteEnvVariableSpy = vi.spyOn(environmentVariablesService, "deleteEnvVariable");
        component.onDelete(MOCK_VAR_KEY);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvVariableSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add env variable", () => {
        const ngbModalServiceOpenSpy = vi.spyOn(ngbModalService, "open");
        component.onAddOrEditRow();
        expect(ngbModalServiceOpenSpy).toHaveBeenCalledTimes(1);
    });
});
