/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsComponent } from "./dataset-settings.component";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";
import { provideToastr } from "ngx-toastr";
import { SettingsTabsEnum } from "./dataset-settings.model";
import { emitClickOnElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { ChangeDetectionStrategy } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { mockMetadataRootUpdate, mockOverviewDataUpdate } from "../data-tabs.mock";
import { of } from "rxjs";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

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
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        })
            .overrideComponent(DatasetSettingsComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetSettingsTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: {
                schema: mockMetadataRootUpdate.schema,
                content: mockOverviewDataUpdate.content,
                overview: structuredClone(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
                size: mockOverviewDataUpdate.size,
            } as OverviewUpdate,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to action list item", () => {
        component.activeTab = SettingsTabsEnum.SCHEDULING;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        spyOn(component, "visibilitySettingsMenuItem").and.returnValue(true);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.SCHEDULING}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ section: SettingsTabsEnum.SCHEDULING }),
        );

        component.activeTab = SettingsTabsEnum.GENERAL;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.GENERAL}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ section: SettingsTabsEnum.GENERAL }),
        );
    });
});
