/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPeopleModalComponent } from "./add-people-modal.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NgbActiveModal, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { FormsModule } from "@angular/forms";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("AddPeopleModalComponent", () => {
    let component: AddPeopleModalComponent;
    let fixture: ComponentFixture<AddPeopleModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddPeopleModalComponent],
            imports: [
                SharedTestModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                MatDividerModule,
                MatIconModule,
                FormsModule,
                NgbTypeaheadModule,
            ],
            providers: [Apollo, NgbActiveModal],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddPeopleModalComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.collaborator = null;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
