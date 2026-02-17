/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataPushSourcesTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-push-sources-tab/metadata-push-sources-tab.component";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("MetadataPushSourcesTabComponent", () => {
    let component: MetadataPushSourcesTabComponent;
    let fixture: ComponentFixture<MetadataPushSourcesTabComponent>;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataPushSourcesTabComponent, SharedTestModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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
