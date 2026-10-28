/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of, Subject } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { ViewDatasetEnvVarConnectionDataFragment } from "@api/kamu.graphql.interface";
import { MOCK_VAR_KEY, mockListEnvVariablesQuery } from "@api/mock/environment-variables-and-secrets.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetEnvironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-environment-variables.service";
import { DatasetSettingsSecretsManagerTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-settings-secrets-manager-tab.component";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetSettingsSecretsManagerTabComponent", () => {
    let component: DatasetSettingsSecretsManagerTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSecretsManagerTabComponent>;
    let navigationService: NavigationService;
    let environmentVariablesService: DatasetEnvironmentVariablesService;
    let ngbModalService: NgbModal;
    let modalService: ModalService;
    let listEnvVariablesSpy: Mock<DatasetEnvironmentVariablesService["listEnvVariables"]>;

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
        listEnvVariablesSpy = vi
            .spyOn(environmentVariablesService, "listEnvVariables")
            .mockReturnValue(
                of(requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables)),
            );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        expect(component.currentPage).toEqual(1);
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");

        component.onPageChange(3);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
        expect(component.currentPage).toEqual(3);
    });

    it("should load the first page when the URL has no page", () => {
        expect(listEnvVariablesSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 0 }));
    });

    it("should load the page the URL names when it changes", () => {
        listEnvVariablesSpy.mockClear();

        setComponentInput(fixture, "page", "4");
        fixture.detectChanges();

        expect(component.currentPage).toEqual(4);
        expect(listEnvVariablesSpy).toHaveBeenCalledTimes(1);
        expect(listEnvVariablesSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
    });

    it("should say a page past the last one has no variables and lead to the last page", async () => {
        const envVariables = requireValue(mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars.listEnvVariables);
        const response$ = new Subject<ViewDatasetEnvVarConnectionDataFragment>();
        vi.spyOn(environmentVariablesService, "listEnvVariables").mockReturnValue(response$);
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");
        // A table that starts empty and stays empty gives Angular no reason to re-render on its own
        fixture.destroy();
        const pastEndFixture = TestBed.createComponent(DatasetSettingsSecretsManagerTabComponent);
        setComponentInput(pastEndFixture, "variablesAndSecretsTabData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
        setComponentInput(pastEndFixture, "datasetInfo", MOCK_DATASET_INFO);
        setComponentInput(pastEndFixture, "page", "5");
        pastEndFixture.detectChanges();

        response$.next({
            ...structuredClone(envVariables),
            nodes: [],
            pageInfo: { ...envVariables.pageInfo, totalPages: 3 },
        });
        response$.complete();

        const pagePastEnd = await TestbedHarnessEnvironment.loader(pastEndFixture).getHarness(PagePastEndHarness);
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
