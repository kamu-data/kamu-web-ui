/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessModalComponent } from "./data-access-modal.component";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";
import { mockDatasetEndPoints } from "../data-access-panel-mock.data";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { DataAccessTabsEnum } from "./data-access-modal.model";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { AppConfigService } from "src/app/app-config.service";
import { ProtocolsService } from "src/app/services/protocols.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("DataAccessModalComponent", () => {
    let component: DataAccessModalComponent;
    let fixture: ComponentFixture<DataAccessModalComponent>;
    let loggedUserService: LoggedUserService;
    let appConfigService: AppConfigService;
    let protocolsService: ProtocolsService;
    let getProtocolsSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [DataAccessModalComponent],
    providers: [Apollo, NgbActiveModal, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessModalComponent);
        loggedUserService = TestBed.inject(LoggedUserService);
        appConfigService = TestBed.inject(AppConfigService);
        protocolsService = TestBed.inject(ProtocolsService);
        getProtocolsSpy = spyOn(protocolsService, "getProtocols").and.returnValue(of(mockDatasetEndPoints));
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init protocols", () => {
        const accountName = component.datasetBasics.owner.accountName;
        const datasetName = component.datasetBasics.name;
        expect(getProtocolsSpy).toHaveBeenCalledOnceWith({ accountName, datasetName });
    });

    it("should check navigate to section", () => {
        expect(component.activeTab).toEqual(DataAccessTabsEnum.LINK);
        component.navigateToSection(DataAccessTabsEnum.KAMU_CLI);
        expect(component.activeTab).toEqual(DataAccessTabsEnum.KAMU_CLI);
    });

    it("should check showApiTokensLink getter", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue({
            enableLogout: true,
            enableScheduling: true,
            enableDatasetEnvVarsManagement: true,
            enableTermsOfService: true,
            allowAnonymous: true,
        });
        expect(component.showApiTokensLink).toEqual(true);
    });
});
