/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { FlowProcessEffectiveState, FlowProcessSummary } from "@api/kamu.graphql.interface";
import { mockAccountFlowsAsCardsQuery } from "@api/mock/account.mock";

import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { DatasetFlowProcessCardHarness } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.harness";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("DatasetFlowProcessCardComponent", () => {
    let component: DatasetFlowProcessCardComponent;
    let fixture: ComponentFixture<DatasetFlowProcessCardComponent>;

    const mockSummary = mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes.allCards.nodes[0]
        .summary as FlowProcessSummary;

    function createCard(effectiveState: FlowProcessEffectiveState): Promise<DatasetFlowProcessCardHarness> {
        fixture = TestBed.createComponent(DatasetFlowProcessCardComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput("datasetBasics", mockDatasetBasicsRootFragment);
        fixture.componentRef.setInput("summary", { ...mockSummary, effectiveState } satisfies FlowProcessSummary);
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, DatasetFlowProcessCardHarness);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetFlowProcessCardComponent, SharedTestModule],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        registerMatSvgIcons();
    });

    it("should create", async () => {
        await createCard(FlowProcessEffectiveState.Active);
        expect(component).toBeTruthy();
    });

    it("should emit the dataset when 'Update now' is clicked", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active);
        const updateNowEmitterSpy = spyOn(component.updateNowEmitter, "emit");

        await card.clickUpdateNow();

        expect(updateNowEmitterSpy).toHaveBeenCalledOnceWith(mockDatasetBasicsRootFragment);
    });

    it("should emit the current state and dataset when the state toggle is clicked", async () => {
        const card = await createCard(FlowProcessEffectiveState.Failing);
        const toggleStateDatasetCardEmitterSpy = spyOn(component.toggleStateDatasetCardEmitter, "emit");

        await card.clickToggleState();

        expect(toggleStateDatasetCardEmitterSpy).toHaveBeenCalledOnceWith({
            state: FlowProcessEffectiveState.Failing,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
    });

    [
        { state: FlowProcessEffectiveState.Active, stateText: "ACTIVE", label: "Pause updates" },
        { state: FlowProcessEffectiveState.Failing, stateText: "FAILING", label: "Pause updates" },
        { state: FlowProcessEffectiveState.PausedManual, stateText: "PAUSED", label: "Resume updates" },
        { state: FlowProcessEffectiveState.StoppedAuto, stateText: "STOPPED", label: "Resume updates" },
    ].forEach(({ state, stateText, label }) => {
        it(`should show '${stateText}' and offer '${label}' for state=${state}`, async () => {
            const card = await createCard(state);

            expect(await card.getStateText()).toEqual(stateText);
            expect(await card.getToggleStateLabel()).toEqual(label);
            expect(await card.isToggleStateDisabled()).toBeFalse();
        });
    });

    it("should disable the state toggle for an unconfigured process", async () => {
        const card = await createCard(FlowProcessEffectiveState.Unconfigured);

        expect(await card.getStateText()).toEqual("UNCONFIGURED");
        expect(await card.isToggleStateDisabled()).toBeTrue();
    });
});
