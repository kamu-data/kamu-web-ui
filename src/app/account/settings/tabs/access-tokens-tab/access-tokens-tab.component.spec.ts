import { emitClickOnElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MatTableModule } from "@angular/material/table";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccessTokensTabComponent } from "./access-tokens-tab.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { mockAccountDetailsWithEmail } from "src/app/api/mock/auth.mock";
import { ToastrModule } from "ngx-toastr";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { TOKEN_ID, mockCreateAccessTokenMutation, mockListAccessTokensQuery } from "src/app/api/mock/access-token.mock";
import { of } from "rxjs";
import { AccessTokenConnection, CreateAccessTokenResultSuccess } from "src/app/api/kamu.graphql.interface";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { TokenCreateStep } from "../../account-settings.constants";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";

describe("AccessTokensTabComponent", () => {
    let component: AccessTokensTabComponent;
    let fixture: ComponentFixture<AccessTokensTabComponent>;
    let navigationService: NavigationService;
    let accessTokenService: AccessTokenService;
    let modalService: ModalService;
    const MOCK_PAGE = 3;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccessTokensTabComponent, PaginationComponent],
            providers: [
                FormBuilder,
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
                ToastrModule.forRoot(),
                ApolloTestingModule,
                MatTableModule,
                MatIconModule,
                FormsModule,
                ReactiveFormsModule,
                MatDividerModule,
                HttpClientModule,
                NgbPaginationModule,
                MatSlideToggleModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AccessTokensTabComponent);
        navigationService = TestBed.inject(NavigationService);
        accessTokenService = TestBed.inject(AccessTokenService);
        modalService = TestBed.inject(ModalService);
        component = fixture.componentInstance;
        component.currentPage = 1;
        spyOn(accessTokenService, "listAccessTokens").and.returnValue(
            of(mockListAccessTokensQuery.auth.listAccessTokens as AccessTokenConnection),
        );
        component.account = mockAccountDetailsWithEmail;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        const navigateToSettingsSpy = spyOn(navigationService, "navigateToSettings");
        component.onPageChange(MOCK_PAGE);
        expect(component.currentPage).toEqual(MOCK_PAGE);
        expect(navigateToSettingsSpy).toHaveBeenCalledTimes(1);
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
