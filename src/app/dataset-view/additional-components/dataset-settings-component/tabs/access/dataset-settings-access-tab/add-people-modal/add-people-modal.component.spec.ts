/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { AddPeopleModalComponent } from "./add-people-modal.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NgbActiveModal, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetCollaborationsService } from "../dataset-collaborations.service";
import { of } from "rxjs";
import { DatasetAccessRole, NameLookupResult } from "src/app/api/kamu.graphql.interface";
import { mockDatasetSearchCollaboratorQuery } from "src/app/api/mock/dataset-collaborations.mock";
import AppValues from "src/app/common/values/app.values";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("AddPeopleModalComponent", () => {
    let component: AddPeopleModalComponent;
    let fixture: ComponentFixture<AddPeopleModalComponent>;
    let datasetCollaborationsService: DatasetCollaborationsService;
    let ngbActiveModal: NgbActiveModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, AddPeopleModalComponent],
            providers: [
                Apollo,
                NgbActiveModal,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddPeopleModalComponent);
        datasetCollaborationsService = TestBed.inject(DatasetCollaborationsService);
        ngbActiveModal = TestBed.inject(NgbActiveModal);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.activeCollaboratorsIds = [];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check clear selected collaborator", () => {
        component.selectedCollaborator = mockDatasetSearchCollaboratorQuery.search.nameLookup
            .nodes[0] as NameLookupResult;
        component.searchPerson = "qwe";

        component.closeSelectedMember();
        expect(component.selectedCollaborator).toBeNull();
        expect(component.searchPerson).toEqual("");
    });

    it("should check select collaborator", () => {
        const nameLookupResult = mockDatasetSearchCollaboratorQuery.search.nameLookup.nodes[0] as NameLookupResult;

        const item: NgbTypeaheadSelectItemEvent<NameLookupResult> = {
            item: nameLookupResult,
            preventDefault: () => null,
        };
        component.onSelectItem(item);

        expect(component.selectedCollaborator).toEqual(nameLookupResult);
        expect(component.searchPerson).toEqual("");
    });

    it("should check search collaborator", fakeAsync(() => {
        const searchCollaboratorSpy = spyOn(datasetCollaborationsService, "searchCollaborator").and.returnValue(of([]));
        component.search(of("test")).subscribe();
        tick(AppValues.SHORT_DELAY_MS);
        expect(searchCollaboratorSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check save changes", () => {
        component.role = DatasetAccessRole.Editor;
        component.selectedCollaborator = mockDatasetSearchCollaboratorQuery.search.nameLookup
            .nodes[0] as NameLookupResult;
        const ngbActiveModalCloseSpy = spyOn(ngbActiveModal, "close");
        component.saveChanges();
        expect(ngbActiveModalCloseSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ role: component.role, accountId: component.selectedCollaborator.id }),
        );
    });

    it("should check save formatter", () => {
        const result = mockDatasetSearchCollaboratorQuery.search.nameLookup.nodes[0] as NameLookupResult;
        expect(component.formatter(result)).toEqual(result.accountName);
    });
});
