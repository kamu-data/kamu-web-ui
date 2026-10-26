/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ApplicationRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { WidgetHeightService } from "@common/components/lineage-graph/widget-height.service";
import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { DatasetViewMenuComponent } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("DatasetViewMenuComponent", () => {
    let component: DatasetViewMenuComponent;
    let fixture: ComponentFixture<DatasetViewMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, DatasetViewMenuComponent],
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetViewMenuComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(fixture, "datasetPermissions", mockFullPowerDatasetPermissionsFragment);
        setComponentInput(fixture, "datasetViewType", DatasetViewTypeEnum.Metadata);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check element has appFeatureFlag directive", () => {
        const navigateToDiscussionsElem = findElementByDataTestId(fixture, "navigateToDiscussions");
        expect(navigateToDiscussionsElem?.hasAttribute("appfeatureflag")).toBe(true);
        expect(navigateToDiscussionsElem?.getAttribute("appfeatureflag")).toEqual("dataset.panel.discussions");
    });

    it("should report the menu offset to the widget height service once rendered", () => {
        const setWidgetOffsetTopSpy = vi
            .spyOn(TestBed.inject(WidgetHeightService), "setWidgetOffsetTop")
            .mockImplementation(() => {});
        const menuFixture = TestBed.createComponent(DatasetViewMenuComponent);
        setComponentInput(menuFixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(menuFixture, "datasetPermissions", mockFullPowerDatasetPermissionsFragment);
        setComponentInput(menuFixture, "datasetViewType", DatasetViewTypeEnum.Metadata);
        expect(setWidgetOffsetTopSpy).not.toHaveBeenCalled();

        menuFixture.detectChanges();
        TestBed.inject(ApplicationRef).tick();

        const menuElement = findElementByDataTestId(menuFixture, "dataset-view-menu");
        expect(setWidgetOffsetTopSpy).toHaveBeenCalledTimes(1);
        expect(setWidgetOffsetTopSpy).toHaveBeenCalledWith(
            (menuElement?.clientHeight ?? 0) + (menuElement?.offsetTop ?? 0),
        );
    });
});
