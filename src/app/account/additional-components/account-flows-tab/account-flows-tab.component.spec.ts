/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from "@angular/core/testing";
import { AccountFlowsTabComponent } from "./account-flows-tab.component";
import { provideToastr } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountService } from "src/app/account/account.service";
import { mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { Apollo } from "apollo-angular";
import { AccountFlowsNav } from "./account-flows-tab.types";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";

describe("AccountFlowsTabComponent", () => {
    let component: AccountFlowsTabComponent;
    let fixture: ComponentFixture<AccountFlowsTabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountFlowsTabComponent],
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
        }).compileComponents();

        fixture = TestBed.createComponent(AccountFlowsTabComponent);
        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        component.accountFlowsData = {
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Finished],
        };
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to change navigation", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const event = {
            nextId: AccountFlowsNav.DATASETS,
        } as NgbNavChangeEvent;
        component.onNavChange(event);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
    });

    it("should empty block is visible", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
        spyOn(accountService, "accountAllFlowsPaused").and.returnValue(of(false));
        spyOn(accountService, "getAccountListFlows").and.returnValue(of(mockFlowsTableData));
        tick();
        fixture.detectChanges();

        const emptyBlock = findElementByDataTestId(fixture, "empty-block");
        expect(emptyBlock).toBeDefined();
        discardPeriodicTasks();
    }));
});
