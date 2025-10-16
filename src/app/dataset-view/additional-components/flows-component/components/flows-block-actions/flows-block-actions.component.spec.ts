/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsBlockActionsComponent } from "./flows-block-actions.component";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetFlowProcess, FlowProcessEffectiveState } from "src/app/api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SettingsTabsEnum } from "../../../dataset-settings-component/dataset-settings.model";

describe("FlowsBlockActionsComponent", () => {
    let component: FlowsBlockActionsComponent;
    let fixture: ComponentFixture<FlowsBlockActionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsBlockActionsComponent, SharedTestModule, HttpClientTestingModule],
            providers: [Apollo, provideToastr()],
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

    it("should check redirect section", () => {
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        fixture.detectChanges();
        expect(component.redirectSection).toEqual(SettingsTabsEnum.TRANSFORM_SETTINGS);
    });

    it("should check `Update now` button", () => {
        fixture.detectChanges();
        const updateEmitterEmitSpy = spyOn(component.updateEmitter, "emit");
        component.updateNow();
        expect(updateEmitterEmitSpy).toHaveBeenCalledTimes(1);
    });

    it("should check `Refresh flow` button", () => {
        fixture.detectChanges();
        const refreshEmitterEmitSpy = spyOn(component.refreshEmitter, "emit");
        component.refreshFlow();
        expect(refreshEmitterEmitSpy).toHaveBeenCalledTimes(1);
    });

    it("should check toggle effective state", () => {
        fixture.detectChanges();
        const toggleStateDatasetFlowConfigsEmitterSpy = spyOn(component.toggleStateDatasetFlowConfigsEmitter, "emit");
        component.toggleStateDatasetFlowConfigs(FlowProcessEffectiveState.Active);
        expect(toggleStateDatasetFlowConfigsEmitterSpy).toHaveBeenCalledTimes(1);
    });
});
