/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { AddPeopleModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/add-people-modal/add-people-modal.component";
import { DatasetCollaborationsService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-collaborations.service";
import { DatasetSettingsAccessTabComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-settings-access-tab.component";
import { EditCollaboratorModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/edit-collaborator-modal/edit-collaborator-modal.component";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { ModalService } from "@common/components/modal/modal.service";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { AccountWithRoleConnection, DatasetAccessRole } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { MOCK_ACCOUNT_WITH_ROLE, mockDatasetListCollaboratorsQuery } from "@api/mock/dataset-collaborations.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

describe("DatasetSettingsAccessTabComponent", () => {
    let component: DatasetSettingsAccessTabComponent;
    let fixture: ComponentFixture<DatasetSettingsAccessTabComponent>;
    let datasetCollaborationsService: DatasetCollaborationsService;
    let navigationService: NavigationService;
    let ngbModal: NgbModal;
    let modalService: ModalService;
    let loggedUserService: LoggedUserService;

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
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return 2;
                                    }
                                },
                            },
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
                provideHttpClient(withInterceptorsFromDi()),
            ],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsAccessTabComponent);
        datasetCollaborationsService = TestBed.inject(DatasetCollaborationsService);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        ngbModal = TestBed.inject(NgbModal);
        modalService = TestBed.inject(ModalService);
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        spyOn(datasetCollaborationsService, "listCollaborators").and.returnValue(
            of(
                mockDatasetListCollaboratorsQuery.datasets.byId?.collaboration
                    .accountRoles as AccountWithRoleConnection,
            ),
        );
        component = fixture.componentInstance;
        component.accessViewData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        const page = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");

        component.onPageChange(page);
        expect(component.currentPage).toEqual(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith(jasmine.objectContaining({ page }));
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
        const ngbModalOpenSpy = spyOn(ngbModal, "open").and.callThrough();
        await component.addPeople();
        expect(ngbModalOpenSpy).toHaveBeenCalledOnceWith(AddPeopleModalComponent);
    });

    it("should check click on 'Edit' button", () => {
        const ngbModalOpenSpy = spyOn(ngbModal, "open").and.callThrough();
        component.editCollaborator(MOCK_ACCOUNT_WITH_ROLE);

        expect(ngbModalOpenSpy).toHaveBeenCalledOnceWith(EditCollaboratorModalComponent);
    });

    it("should check remove collaborator", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const unsetRoleCollaboratorSpy = spyOn(datasetCollaborationsService, "unsetRoleCollaborator").and.callFake(() =>
            of(),
        );

        component.removeCollaborator(MOCK_ACCOUNT_WITH_ROLE);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                datasetId: component.datasetBasics.id,
                accountIds: [MOCK_ACCOUNT_WITH_ROLE.account.id],
            }),
        );
    });

    it("should check remove all collaborators", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const unsetRoleCollaboratorSpy = spyOn(datasetCollaborationsService, "unsetRoleCollaborator").and.callFake(() =>
            of(),
        );
        component.masterToggle();

        component.removeAllMembers();
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(unsetRoleCollaboratorSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                datasetId: component.datasetBasics.id,
                accountIds: [
                    mockDatasetListCollaboratorsQuery.datasets.byId?.collaboration.accountRoles.nodes[0].account.id,
                ],
            }),
        );
    });

    it("should check apply filter", () => {
        const testSearch = "Test";
        component.applyFilter(testSearch);
        expect(component.dataSource.filter).toEqual(testSearch.toLowerCase());
    });
});
