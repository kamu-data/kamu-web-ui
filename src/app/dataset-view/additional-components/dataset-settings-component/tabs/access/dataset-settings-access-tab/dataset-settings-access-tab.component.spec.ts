/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { NEVER, of } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { DatasetAccessRole } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { MOCK_ACCOUNT_WITH_ROLE, mockDatasetCollaboratorsConnection } from "@api/mock/dataset-collaborations.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { AddPeopleModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/add-people-modal/add-people-modal.component";
import { DatasetCollaborationsService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-collaborations.service";
import { DatasetSettingsAccessTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-settings-access-tab.component";
import { EditCollaboratorModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/edit-collaborator-modal/edit-collaborator-modal.component";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetSettingsAccessTabComponent", () => {
    let component: DatasetSettingsAccessTabComponent;
    let fixture: ComponentFixture<DatasetSettingsAccessTabComponent>;
    let datasetCollaborationsService: DatasetCollaborationsService;
    let navigationService: NavigationService;
    let ngbModal: NgbModal;
    let modalService: ModalService;
    let loggedUserService: LoggedUserService;
    let listCollaboratorsSpy: Mock<DatasetCollaborationsService["listCollaborators"]>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetSettingsAccessTabComponent],
            providers: [
                Apollo,
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
            ],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsAccessTabComponent);
        datasetCollaborationsService = TestBed.inject(DatasetCollaborationsService);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        ngbModal = TestBed.inject(NgbModal);
        modalService = TestBed.inject(ModalService);
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        listCollaboratorsSpy = vi
            .spyOn(datasetCollaborationsService, "listCollaborators")
            .mockReturnValue(of(mockDatasetCollaboratorsConnection));
        component = fixture.componentInstance;
        setComponentInput(fixture, "accessViewData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
        setComponentInput(fixture, "page", "2");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should load the page from the URL", () => {
        expect(component.currentPage).toEqual(2);
        expect(listCollaboratorsSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            page: 1,
            perPage: component.PER_PAGE,
        });
    });

    it("should load the new page when the URL page changes", () => {
        listCollaboratorsSpy.mockClear();

        setComponentInput(fixture, "page", "3");
        fixture.detectChanges();

        expect(component.currentPage).toEqual(3);
        expect(listCollaboratorsSpy).toHaveBeenCalledTimes(1);
        expect(listCollaboratorsSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            page: 2,
            perPage: component.PER_PAGE,
        });
    });

    it("should load the first page when the URL has no page", () => {
        listCollaboratorsSpy.mockClear();

        setComponentInput(fixture, "page", undefined);
        fixture.detectChanges();

        expect(component.currentPage).toEqual(1);
        expect(listCollaboratorsSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 0 }));
    });

    it("should check change page", () => {
        const page = 2;
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});

        component.onPageChange(page);
        expect(component.currentPage).toEqual(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(expect.objectContaining({ page }));
    });

    it("should say a page past the last one has no collaborators and lead to the last page", async () => {
        vi.spyOn(datasetCollaborationsService, "listCollaborators").mockReturnValue(
            of({
                ...structuredClone(mockDatasetCollaboratorsConnection),
                nodes: [],
                pageInfo: { ...mockDatasetCollaboratorsConnection.pageInfo, totalPages: 1 },
            }),
        );
        // The shared fixture would re-render alongside, and its pager move from page 2 to its only page
        fixture.destroy();
        const pastEndFixture = TestBed.createComponent(DatasetSettingsAccessTabComponent);
        setComponentInput(pastEndFixture, "accessViewData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
        setComponentInput(pastEndFixture, "page", "2");
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");

        const pagePastEnd = await TestbedHarnessEnvironment.loader(pastEndFixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no collaborators on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
    });

    it("should not report a page past the last one while the collaborators load", async () => {
        vi.spyOn(datasetCollaborationsService, "listCollaborators").mockReturnValue(NEVER);
        fixture.destroy();
        const loadingFixture = TestBed.createComponent(DatasetSettingsAccessTabComponent);
        setComponentInput(loadingFixture, "accessViewData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
        setComponentInput(loadingFixture, "page", "2");

        const pagePastEnd = await TestbedHarnessEnvironment.loader(loadingFixture).getAllHarnesses(PagePastEndHarness);
        expect(pagePastEnd).toEqual([]);
    });

    [
        { role: DatasetAccessRole.Reader, expected: "library_books" },
        { role: DatasetAccessRole.Editor, expected: "edit_document" },
        { role: DatasetAccessRole.Maintainer, expected: "manage_accounts" },
    ].forEach((item: { role: DatasetAccessRole; expected: string }) => {
        it(`should check set icon for ${item.role}`, () => {
            expect(component.setRoleIcon({ ...MOCK_ACCOUNT_WITH_ROLE, ...{ role: item.role } })).toEqual(item.expected);
        });
    });

    it("should check click on 'Add people' button", async () => {
        const ngbModalOpenSpy = vi.spyOn(ngbModal, "open");
        await component.addPeople();
        expect(ngbModalOpenSpy).toHaveBeenCalledTimes(1);
        expect(ngbModalOpenSpy).toHaveBeenCalledWith(AddPeopleModalComponent, {});
    });

    it("should check click on 'Edit' button", () => {
        const ngbModalOpenSpy = vi.spyOn(ngbModal, "open");
        component.editCollaborator(MOCK_ACCOUNT_WITH_ROLE);

        expect(ngbModalOpenSpy).toHaveBeenCalledTimes(1);

        expect(ngbModalOpenSpy).toHaveBeenCalledWith(EditCollaboratorModalComponent, {});
    });

    it("should check remove collaborator", () => {
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const unsetRoleCollaboratorSpy = vi
            .spyOn(datasetCollaborationsService, "unsetRoleCollaborator")
            .mockImplementation(() => of());

        component.removeCollaborator(MOCK_ACCOUNT_WITH_ROLE);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledTimes(1);
        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                datasetId: component.datasetBasics.id,
                accountIds: [MOCK_ACCOUNT_WITH_ROLE.account.id],
            }),
        );
    });

    it("should check remove all collaborators", () => {
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const unsetRoleCollaboratorSpy = vi
            .spyOn(datasetCollaborationsService, "unsetRoleCollaborator")
            .mockImplementation(() => of());
        component.masterToggle();

        component.removeAllMembers();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledTimes(1);
        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                datasetId: component.datasetBasics.id,
                accountIds: [mockDatasetCollaboratorsConnection.nodes[0].account.id],
            }),
        );
    });

    it("should check apply filter", () => {
        const testSearch = "Test";
        component.applyFilter(testSearch);
        expect(component.dataSource.filter).toEqual(testSearch.toLowerCase());
    });
});
