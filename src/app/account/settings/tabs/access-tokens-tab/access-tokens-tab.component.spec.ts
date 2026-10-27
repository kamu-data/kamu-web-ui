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

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import {
    emitClickOnElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { mockAccessTokenConnectionData, mockCreatedAccessTokenData, TOKEN_ID } from "@api/mock/access-token.mock";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { AccountSettingsTabs, TokenCreateStep } from "src/app/account/settings/account-settings.constants";
import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { AccessTokensTabComponent } from "src/app/account/settings/tabs/access-tokens-tab/access-tokens-tab.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("AccessTokensTabComponent", () => {
    let component: AccessTokensTabComponent;
    let fixture: ComponentFixture<AccessTokensTabComponent>;
    let navigationService: NavigationService;
    let accessTokenService: AccessTokenService;
    let modalService: ModalService;
    let loggedUserService: LoggedUserService;
    const MOCK_PAGE = 3;
    let navigateToSettingsSpy: Mock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccessTokensTabComponent],
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
                provideHttpClient(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AccessTokensTabComponent);
        navigationService = TestBed.inject(NavigationService);
        accessTokenService = TestBed.inject(AccessTokenService);
        modalService = TestBed.inject(ModalService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        navigateToSettingsSpy = vi.spyOn(navigationService, "navigateToSettings").mockImplementation(() => {});
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        setComponentInput(fixture, "tokenConnectionData", mockAccessTokenConnectionData);
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        component.onPageChange(MOCK_PAGE);
        expect(navigateToSettingsSpy).toHaveBeenCalledTimes(1);
        expect(navigateToSettingsSpy).toHaveBeenCalledWith(AccountSettingsTabs.ACCESS_TOKENS, MOCK_PAGE);
    });

    it("should say a page past the last one has no access tokens and lead to the last page", async () => {
        setComponentInput(fixture, "tokenConnectionData", {
            ...structuredClone(mockAccessTokenConnectionData),
            nodes: [],
            pageInfo: { ...mockAccessTokenConnectionData.pageInfo, currentPage: 98, totalPages: 3 },
        });

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no access tokens on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToSettingsSpy).toHaveBeenCalledWith(AccountSettingsTabs.ACCESS_TOKENS, 3);
    });

    it("should check add new token button", () => {
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "new-token-button");
        expect(component.currentCreateStep).toEqual(TokenCreateStep.GENERATE);
    });

    it("should check generate new token button", () => {
        component.currentCreateStep = TokenCreateStep.GENERATE;
        const createAccessTokensSpy = vi
            .spyOn(accessTokenService, "createAccessTokens")
            .mockReturnValue(of(mockCreatedAccessTokenData));
        component.createTokenForm.controls.name.setValue("token-name");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "generate-new-token");

        expect(component.currentCreateStep).toEqual(TokenCreateStep.GENERATE);
        expect(createAccessTokensSpy).toHaveBeenCalledTimes(1);
    });

    it("should check return to initial step", () => {
        component.currentCreateStep = TokenCreateStep.GENERATE;
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "cancel-button");
        expect(component.currentCreateStep).toEqual(TokenCreateStep.INITIAL);
    });

    function filteredTokenNames(): string[] {
        return component.dataSource.filteredData.map((token) => token.name);
    }

    it("should fill the table from the resolved token connection", () => {
        expect(component.dataSource.data).toEqual(mockAccessTokenConnectionData.nodes);
        expect(component.pageBasedInfo).toEqual(mockAccessTokenConnectionData.pageInfo);
        expect(filteredTokenNames()).toEqual(["q2"]);
    });

    it("should check refresh filter", () => {
        component.applyFilter("test-token-name");
        expect(filteredTokenNames()).toEqual([]);

        component.refreshSearchByName();
        expect(component.dataSource.filter).toEqual("");
        expect(filteredTokenNames()).toEqual(["q1", "q2"]);
    });

    it("should check apply filter", () => {
        component.applyFilter(" Q1 ");
        expect(component.dataSource.filter).toEqual("q1");
        expect(filteredTokenNames()).toEqual(["q1"]);
    });

    it("should check revoke token", () => {
        const revokeAccessTokensSpy = vi.spyOn(accessTokenService, "revokeAccessTokens").mockReturnValue(of());
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        component.deleteToken(TOKEN_ID);

        expect(revokeAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check done button", () => {
        component.currentCreateStep = TokenCreateStep.GENERATE;
        component.onDone();

        expect(component.currentCreateStep).toEqual(TokenCreateStep.FINISH);
    });

    it("should check toggle status tokens", () => {
        component.showRevokedToken = true;
        component.toggleTokens();
        expect(component.dataSource.filter).toEqual("");
        expect(filteredTokenNames()).toEqual(["q1", "q2"]);

        component.showRevokedToken = false;
        component.toggleTokens();
        expect(component.dataSource.filter).toEqual("false");
        expect(filteredTokenNames()).toEqual(["q2"]);
    });
});
