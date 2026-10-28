/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";

import { provideToastr } from "ngx-toastr";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { FetchStepMqttDataFragment } from "@api/kamu.graphql.interface";

import {
    mockFetchStepMqtt,
    mockSetPollingSourceEventWithFetchStepMqtt,
} from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataPollingSourceTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-polling-source-tab/metadata-polling-source-tab.component";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("MetadataPollingSourceTabComponent", () => {
    let component: MetadataPollingSourceTabComponent;
    let fixture: ComponentFixture<MetadataPollingSourceTabComponent>;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataPollingSourceTabComponent, SharedTestModule, MatIconModule],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(MetadataPollingSourceTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            metadataSummary: mockMetadataRootUpdate.metadataSummary,
        });
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to redirect to 'polling-source' route", () => {
        const navigateToAddPollingSourceSpy = vi
            .spyOn(navigationService, "navigateToAddPollingSource")
            .mockImplementation(() => {});
        component.navigateToEditPollingSource();
        expect(navigateToAddPollingSourceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to render data", () => {
        const url = findElementByDataTestId(fixture, "fetch-step-url");
        const fetch = mockMetadataRootUpdate.metadataSummary.metadata.currentPollingSource?.fetch;
        expect(fetch?.__typename).toEqual("FetchStepUrl");
        if (fetch?.__typename === "FetchStepUrl") {
            expect(url?.innerText.trim()).toEqual(fetch.url);
        }
    });

    describe("MQTT credentials", () => {
        function showMqttSource(fetch: FetchStepMqttDataFragment): void {
            const metadataSummary = mockMetadataRootUpdate.metadataSummary;
            setComponentInput(fixture, "datasetMetadataTabData", {
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                metadataSummary: {
                    ...metadataSummary,
                    metadata: {
                        ...metadataSummary.metadata,
                        currentPollingSource: {
                            ...mockSetPollingSourceEventWithFetchStepMqtt,
                            fetch: { ...mockFetchStepMqtt, ...fetch },
                        },
                    },
                },
            });
            fixture.detectChanges();
        }

        it("should show the credentials that are set", () => {
            showMqttSource(mockFetchStepMqtt);

            expect(findElementByDataTestId(fixture, "fetch-mqtt-username")?.innerText.trim()).toEqual(
                mockFetchStepMqtt.username,
            );
            expect(findElementByDataTestId(fixture, "fetch-mqtt-password")?.innerText.trim()).toEqual(
                mockFetchStepMqtt.password,
            );
        });

        it("should leave out the credentials that are not set", () => {
            showMqttSource({ ...mockFetchStepMqtt, username: null, password: null });

            expect(findElementByDataTestId(fixture, "fetch-mqtt-username")).toBeUndefined();
            expect(findElementByDataTestId(fixture, "fetch-mqtt-password")).toBeUndefined();
        });
    });
});
