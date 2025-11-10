/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountFlowsDatasetsSubtabComponent } from "./account-flows-datasets-subtab.component";
import { AccountFlowsNav } from "../../account-flows-tab.types";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

describe("AccountFlowsDatasetsSubtabComponent", () => {
    let component: AccountFlowsDatasetsSubtabComponent;
    let fixture: ComponentFixture<AccountFlowsDatasetsSubtabComponent>;
    const MOCK_ACCOUNT_NAME = "kamu";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountFlowsDatasetsSubtabComponent, SharedTestModule],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(AccountFlowsDatasetsSubtabComponent);
        component = fixture.componentInstance;
        component.accountName = MOCK_ACCOUNT_NAME;
        component.accountFlowsData = {
            activeNav: AccountFlowsNav.DATASETS,
            flowGroup: FlowStatus.Finished,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
