/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetFlowProcessCardComponent } from "./dataset-flow-process-card.component";
import { SharedTestModule } from "../../common/modules/shared-test.module";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { mockAccountFlowsAsCardsQuery } from "src/app/api/mock/account.mock";
import { FlowProcessEffectiveState, FlowProcessSummary } from "src/app/api/kamu.graphql.interface";
import { registerMatSvgIcons } from "../../common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("DatasetFlowProcessCardComponent", () => {
    let component: DatasetFlowProcessCardComponent;
    let fixture: ComponentFixture<DatasetFlowProcessCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetFlowProcessCardComponent, SharedTestModule, HttpClientTestingModule],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetFlowProcessCardComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.summary = mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes.allCards.nodes[0]
            .summary as FlowProcessSummary;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check 'Update now' handler", () => {
        const updateNowEmitterSpy = spyOn(component.updateNowEmitter, "emit");
        component.updateNow(mockDatasetBasicsRootFragment);
        expect(updateNowEmitterSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment);
    });

    it("should check to toggle the card state", () => {
        const toggleStateDatasetCardEmitterSpy = spyOn(component.toggleStateDatasetCardEmitter, "emit");
        component.toggleStateDatasetCard(FlowProcessEffectiveState.Active, mockDatasetBasicsRootFragment);
        expect(toggleStateDatasetCardEmitterSpy).toHaveBeenCalledTimes(1);
    });
});
