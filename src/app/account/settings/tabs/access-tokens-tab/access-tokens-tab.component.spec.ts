/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { emitClickOnElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccessTokensTabComponent } from "./access-tokens-tab.component";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { TOKEN_ID, mockCreateAccessTokenMutation, mockListAccessTokensQuery } from "src/app/api/mock/access-token.mock";
import { of } from "rxjs";
import { AccessTokenConnection, CreateAccessTokenResultSuccess } from "src/app/api/kamu.graphql.interface";
import { AccountSettingsTabs, TokenCreateStep } from "../../account-settings.constants";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("AccessTokensTabComponent", () => {
    let component: AccessTokensTabComponent;
    let fixture: ComponentFixture<AccessTokensTabComponent>;
    let navigationService: NavigationService;
    let accessTokenService: AccessTokenService;
    let modalService: ModalService;
    let loggedUserService: LoggedUserService;
    const MOCK_PAGE = 3;
    let navigateToSettingsSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
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
            ],
            imports: [HttpClientModule, AccessTokensTabComponent],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AccessTokensTabComponent);
        navigationService = TestBed.inject(NavigationService);
        accessTokenService = TestBed.inject(AccessTokenService);
        modalService = TestBed.inject(ModalService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        navigateToSettingsSpy = spyOn(navigationService, "navigateToSettings");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        component.tokenConnection = mockListAccessTokensQuery.auth.listAccessTokens as AccessTokenConnection;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        component.onPageChange(MOCK_PAGE);
        expect(navigateToSettingsSpy).toHaveBeenCalledOnceWith(AccountSettingsTabs.ACCESS_TOKENS, MOCK_PAGE);
    });

    it("should check add new token button", () => {
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "new-token-button");
        expect(component.currentCreateStep).toEqual(TokenCreateStep.GENERATE);
    });

    it("should check generate new token button", () => {
        component.currentCreateStep = TokenCreateStep.GENERATE;
        const response = (mockCreateAccessTokenMutation.auth.createAccessToken as CreateAccessTokenResultSuccess).token;
        const createAccessTokensSpy = spyOn(accessTokenService, "createAccessTokens").and.returnValue(of(response));
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

    it("should check refresh filter", () => {
        component.dataSource.filter = "test-token-name";
        component.refreshSearchByName();
        expect(component.dataSource.filter).toEqual("");
    });

    it("should check apply filter", () => {
        const searchToken = "test";
        expect(component.dataSource.filter).toEqual("");
        component.applyFilter(searchToken);
        expect(component.dataSource.filter).toEqual(searchToken);
    });

    it("should check revoke token", () => {
        const revokeAccessTokensSpy = spyOn(accessTokenService, "revokeAccessTokens").and.returnValue(of());
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
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

        component.showRevokedToken = false;
        component.toggleTokens();
        expect(component.dataSource.filter).toEqual("false");
    });
});
