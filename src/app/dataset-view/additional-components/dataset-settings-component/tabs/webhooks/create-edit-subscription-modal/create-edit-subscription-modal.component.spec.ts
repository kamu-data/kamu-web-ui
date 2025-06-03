/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateEditSubscriptionModalComponent } from "./create-edit-subscription-modal.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { ReactiveFormsModule } from "@angular/forms";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { ApolloTestingModule } from "apollo-angular/testing";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";

describe("CreateEditSubscriptionModalComponent", () => {
    let component: CreateEditSubscriptionModalComponent;
    let fixture: ComponentFixture<CreateEditSubscriptionModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CreateEditSubscriptionModalComponent],
            imports: [
                SharedTestModule,
                ReactiveFormsModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                NgSelectModule,
                FormValidationErrorsModule,
            ],
            providers: [Apollo, NgbActiveModal],
        });
        fixture = TestBed.createComponent(CreateEditSubscriptionModalComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.subscriptionData = null;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
