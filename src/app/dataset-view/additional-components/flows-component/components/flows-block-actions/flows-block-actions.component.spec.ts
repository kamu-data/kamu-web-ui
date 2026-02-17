/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetFlowProcess } from "@api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "@api/mock/dataset-flow.mock";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

import { SettingsTabsEnum } from "../../../dataset-settings-component/dataset-settings.model";
import { FlowsBlockActionsComponent } from "./flows-block-actions.component";

describe("FlowsBlockActionsComponent", () => {
    let component: FlowsBlockActionsComponent;
    let fixture: ComponentFixture<FlowsBlockActionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsBlockActionsComponent, SharedTestModule],
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(FlowsBlockActionsComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.flowProcess = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes
            .primary as DatasetFlowProcess;
        component.hasPushSources = false;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check redirect section for derivative dataset", () => {
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        fixture.detectChanges();
        expect(component.redirectSection).toEqual(SettingsTabsEnum.TRANSFORM_SETTINGS);
    });

    it("should check redirect section for root dataset", () => {
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
        expect(component.redirectSection).toEqual(SettingsTabsEnum.SCHEDULING);
    });

    it("should check `Refresh flow` button", () => {
        fixture.detectChanges();
        const refreshEmitterEmitSpy = spyOn(component.refreshEmitter, "emit");
        component.refreshFlow();
        expect(refreshEmitterEmitSpy).toHaveBeenCalledTimes(1);
    });
});
