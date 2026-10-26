/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import {
    emitClickOnElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";

import { mockRootOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { DatasetSettingsComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.component";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetSettingsComponent", () => {
    let component: DatasetSettingsComponent;
    let fixture: ComponentFixture<DatasetSettingsComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatasetSettingsComponent],
            providers: [
                Apollo,
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        fragment: of(""),
                        snapshot: {
                            queryParamMap: {
                                get: () => null,
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return mockDatasetBasicsDerivedFragment.owner.accountName;
                                        case "datasetName":
                                            return mockDatasetBasicsDerivedFragment.name;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetSettingsTabData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockRootOverviewUpdate,
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to action list item", () => {
        setComponentInput(fixture, "activeTab", SettingsTabsEnum.SCHEDULING);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        vi.spyOn(component, "visibilitySettingsMenuItem").mockReturnValue(true);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.SCHEDULING}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({ section: SettingsTabsEnum.SCHEDULING }),
        );

        setComponentInput(fixture, "activeTab", SettingsTabsEnum.GENERAL);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.GENERAL}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({ section: SettingsTabsEnum.GENERAL }),
        );
    });
});
