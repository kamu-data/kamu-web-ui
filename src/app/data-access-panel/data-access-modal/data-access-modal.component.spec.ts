/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DataAccessModalComponent } from "src/app/data-access-panel/data-access-modal/data-access-modal.component";
import { DataAccessTabsEnum } from "src/app/data-access-panel/data-access-modal/data-access-modal.model";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { ProtocolsService } from "src/app/services/protocols.service";

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
            providers: [
                Apollo,
                NgbActiveModal,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
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
