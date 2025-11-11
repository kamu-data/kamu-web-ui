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
import { AccountService } from "src/app/account/account.service";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "src/app/account/account.constants";

describe("AccountFlowsDatasetsSubtabComponent", () => {
    let component: AccountFlowsDatasetsSubtabComponent;
    let fixture: ComponentFixture<AccountFlowsDatasetsSubtabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    const MOCK_ACCOUNT_NAME = "kamu";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountFlowsDatasetsSubtabComponent, SharedTestModule],
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
                                            return "1";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        });
        fixture = TestBed.createComponent(AccountFlowsDatasetsSubtabComponent);
        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
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

    // it("should check navigate to owner view with page=1 ", () => {
    //     const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
    //     component.onPageChange(1);
    //     expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
    //         component.accountName,
    //         AccountTabs.FLOWS,
    //         undefined,
    //         component.accountFlowsData.activeNav,
    //         component.accountFlowsData.flowGroup,
    //     );
    // });

    // it("should check navigate to owner view with page>1 ", () => {
    //     const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
    //     component.onPageChange(2);
    //     expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
    //         component.accountName,
    //         AccountTabs.FLOWS,
    //         2,
    //         component.accountFlowsData.activeNav,
    //         component.accountFlowsData.flowGroup,
    //     );
    // });
});
