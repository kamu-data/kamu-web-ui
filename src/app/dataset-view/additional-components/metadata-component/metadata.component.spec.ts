/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import {
    mockMetadataDerivedUpdate,
    mockMetadataRootUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "../data-tabs.mock";
import { MetadataComponent } from "./metadata.component";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "src/app/common/helpers/app.helpers";
import { MetadataTabs } from "./metadata.constants";
import { RouterModule } from "@angular/router";

describe("MetadataComponent", () => {
    let component: MetadataComponent;
    let fixture: ComponentFixture<MetadataComponent>;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, HttpClientTestingModule, MetadataComponent, RouterModule],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER],
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
