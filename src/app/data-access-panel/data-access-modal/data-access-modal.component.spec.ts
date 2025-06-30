/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataAccessLinkTabComponent } from "./tabs/data-access-link-tab/data-access-link-tab.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessModalComponent } from "./data-access-modal.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { of } from "rxjs";
import { mockDatasetEndPoints } from "../data-access-panel-mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DataAccessKamuCliTabComponent } from "./tabs/data-access-kamu-cli-tab/data-access-kamu-cli-tab.component";
import { DataAccessRestTabComponent } from "./tabs/data-access-rest-tab/data-access-rest-tab.component";
import { DataAccessSqlTabComponent } from "./tabs/data-access-sql-tab/data-access-sql-tab.component";
import { DataAccessStreamTabComponent } from "./tabs/data-access-stream-tab/data-access-stream-tab.component";
import { DataAccessCodeTabComponent } from "./tabs/data-access-code-tab/data-access-code-tab.component";
import { DataAccessOdataTabComponent } from "./tabs/data-access-odata-tab/data-access-odata-tab.component";
import { DataAccessExportTabComponent } from "./tabs/data-access-export-tab/data-access-export-tab.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { DataAccessTabsEnum } from "./data-access-modal.model";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { AppConfigService } from "src/app/app-config.service";
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
            providers: [Apollo, NgbActiveModal],
            imports: [
                FormsModule,
                MatDividerModule,
                MatCheckboxModule,
                MatIconModule,
                MatTooltipModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ApolloModule,
                ApolloTestingModule,
                DataAccessModalComponent,
                DataAccessLinkTabComponent,
                DataAccessKamuCliTabComponent,
                DataAccessRestTabComponent,
                DataAccessSqlTabComponent,
                DataAccessStreamTabComponent,
                DataAccessCodeTabComponent,
                DataAccessOdataTabComponent,
                DataAccessExportTabComponent,
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
        });
        expect(component.showApiTokensLink).toEqual(true);
    });
});
