/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

import { DatasetViewTypeEnum } from "../dataset-view.interface";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";

describe("DatasetViewMenuComponent", () => {
    let component: DatasetViewMenuComponent;
    let fixture: ComponentFixture<DatasetViewMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, DatasetViewMenuComponent],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetViewMenuComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;
        component.datasetViewType = DatasetViewTypeEnum.Metadata;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check element has appFeatureFlag directive", () => {
        const navigateToDiscussionsElem = findElementByDataTestId(fixture, "navigateToDiscussions");
        expect(navigateToDiscussionsElem?.hasAttribute("appfeatureflag")).toBeTrue();
        expect(navigateToDiscussionsElem?.getAttribute("appfeatureflag")).toEqual("dataset.panel.discussions");
    });
});
