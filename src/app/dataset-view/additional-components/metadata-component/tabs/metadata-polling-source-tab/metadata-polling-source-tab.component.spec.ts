/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { findElementByDataTestId, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { provideToastr } from "ngx-toastr";
import { FetchStepUrl } from "src/app/api/kamu.graphql.interface";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { mockMetadataRootUpdate } from "../../../data-tabs.mock";
import { MetadataPollingSourceTabComponent } from "./metadata-polling-source-tab.component";

describe("MetadataPollingSourceTabComponent", () => {
    let component: MetadataPollingSourceTabComponent;
    let fixture: ComponentFixture<MetadataPollingSourceTabComponent>;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataPollingSourceTabComponent, SharedTestModule, MatIconModule],
            providers: [
                HIGHLIGHT_OPTIONS_PROVIDER,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(MetadataPollingSourceTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetMetadataTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            metadataSummary: mockMetadataRootUpdate.metadataSummary,
        };
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to redirect to 'polling-source' route", () => {
        const navigateToAddPollingSourceSpy = spyOn(navigationService, "navigateToAddPollingSource");
        component.navigateToEditPollingSource();
        expect(navigateToAddPollingSourceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to render data", () => {
        const url = findElementByDataTestId(fixture, "fetch-step-url");
        const expectedUrl = (
            mockMetadataRootUpdate.metadataSummary.metadata.currentPollingSource?.fetch as FetchStepUrl
        ).url;
        expect(url?.innerText.trim()).toEqual(expectedUrl);
    });
});
