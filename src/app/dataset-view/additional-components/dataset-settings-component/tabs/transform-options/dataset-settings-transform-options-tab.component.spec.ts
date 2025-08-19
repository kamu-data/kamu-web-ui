/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsTransformOptionsTabComponent } from "./dataset-settings-transform-options-tab.component";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetSettingsTransformOptionsTabData } from "./dataset-settings-transform-options-tab.data";

describe("DatasetSettingsTransformOptionsTabComponent", () => {
    let component: DatasetSettingsTransformOptionsTabComponent;
    let fixture: ComponentFixture<DatasetSettingsTransformOptionsTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [ApolloTestingModule, SharedTestModule, DatasetSettingsTransformOptionsTabComponent],
        });
        fixture = TestBed.createComponent(DatasetSettingsTransformOptionsTabComponent);

        component = fixture.componentInstance;
        component.transformTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            reactive: null,
            paused: true,
        } as DatasetSettingsTransformOptionsTabData;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
