/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsAccessTabComponent } from "./dataset-settings-access-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientModule } from "@angular/common/http";
import { DatasetCollaborationsService } from "./dataset-collaborations.service";
import { of } from "rxjs";
import {
    MOCK_ACCOUNT_WITH_ROLE,
    mockDatasetListCollaboratorsQuery,
} from "src/app/api/mock/dataset-collaborations.mock";
import { AccountWithRoleConnection, DatasetAccessRole } from "src/app/api/kamu.graphql.interface";
import { PaginationModule } from "src/app/common/components/pagination-component/pagination.module";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NavigationService } from "src/app/services/navigation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { AddPeopleModalComponent } from "./add-people-modal/add-people-modal.component";
import { EditCollaboratorModalComponent } from "./edit-collaborator-modal/edit-collaborator-modal.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";

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
    providers: [
        Apollo,
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
    ],
    imports: [
        ApolloTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        RouterModule,
        HttpClientModule,
        MatIconModule,
        PaginationModule,
        MatTableModule,
        MatCheckboxModule,
        FormsModule,
        DatasetSettingsAccessTabComponent,
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
