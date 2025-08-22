/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataPushSourcesTabComponent } from "./metadata-push-sources-tab.component";
import { mockFullPowerDatasetPermissionsFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { mockMetadataRootUpdate } from "../../../data-tabs.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("MetadataPushSourcesTabComponent", () => {
    let component: MetadataPushSourcesTabComponent;
    let fixture: ComponentFixture<MetadataPushSourcesTabComponent>;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataPushSourcesTabComponent, HttpClientTestingModule, SharedTestModule],
        });
        fixture = TestBed.createComponent(MetadataPushSourcesTabComponent);
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

    it("should check navigate to edit AddPushSource event with source name", () => {
        const navigateToAddPollingSourceSpy = spyOn(navigationService, "navigateToAddPushSource");
        component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;

        const sourceName = "mockName";
        fixture.detectChanges();

        component.navigateToEditAddPushSource(sourceName);
        expect(navigateToAddPollingSourceSpy).toHaveBeenCalledWith(
            {
                accountName: mockDatasetBasicsRootFragment.owner.accountName,
                datasetName: mockDatasetBasicsRootFragment.name,
            },
            sourceName,
        );
    });
});
