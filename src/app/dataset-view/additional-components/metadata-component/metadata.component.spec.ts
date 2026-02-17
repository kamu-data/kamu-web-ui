/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import {
    mockMetadataDerivedUpdate,
    mockMetadataRootUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataComponent } from "src/app/dataset-view/additional-components/metadata-component/metadata.component";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetKind } from "@api/kamu.graphql.interface";

describe("MetadataComponent", () => {
    let component: MetadataComponent;
    let fixture: ComponentFixture<MetadataComponent>;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, MetadataComponent, RouterModule],
            providers: [
                HIGHLIGHT_OPTIONS_PROVIDER,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        })

            .compileComponents();

        registerMatSvgIcons();

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);

        fixture = TestBed.createComponent(MetadataComponent);
        component = fixture.componentInstance;
        datasetSubsService.emitMetadataSchemaChanged(mockMetadataDerivedUpdate);
        component.datasetMetadataTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: {
                schema: mockMetadataDerivedUpdate.schema,
                content: mockOverviewDataUpdate.content,
                overview: structuredClone(mockOverviewDataUpdateNullable.overview),
                size: mockOverviewDataUpdate.size,
            } as OverviewUpdate,
        };
        component.activeTab = MetadataTabs.Schema;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOnInit and associated properties for derived dataset", () => {
        // Derived dataset mocked by default
        expect(component.datasetMetadataTabData.datasetBasics.kind).toEqual(DatasetKind.Derivative);
        expect(component.currentState).toBeDefined();
        expect(component.currentTransform).toBeTruthy();
        expect(component.currentPollingSource).toBeFalsy();
    });

    it("should check #ngOnInit and associated properties for root dataset", () => {
        component.currentState = mockMetadataRootUpdate;
        component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();

        expect(component.currentTransform).toBeFalsy();
        expect(component.currentPollingSource).toBeTruthy();
    });

    it("should check default values for properties and permissions when no state is defined yet", () => {
        component.currentState = undefined;
        fixture.detectChanges();

        expect(component.currentPage).toEqual(1);
        expect(component.totalPages).toEqual(1);
        expect(component.latestBlockHash).toEqual("");
        expect(component.latestBlockSystemTime).toEqual("");
        expect(component.currentPollingSource).toBeUndefined();
        expect(component.currentTransform).toBeUndefined();
    });

    it("should check page change", () => {
        const pageNumber = 1;
        const pageChangeEmitSpy = spyOn(component.pageChangeEmit, "emit");
        component.onPageChange(pageNumber);
        expect(pageChangeEmitSpy).toHaveBeenCalledWith(pageNumber);
    });
});
