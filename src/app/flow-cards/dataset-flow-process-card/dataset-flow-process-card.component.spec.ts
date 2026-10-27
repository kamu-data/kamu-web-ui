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

import timekeeper from "timekeeper";

import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetBasicsFragment, FlowProcessEffectiveState } from "@api/kamu.graphql.interface";
import { mockAccountFlowsAsCardsQuery } from "@api/mock/account.mock";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { DatasetFlowProcessCardHarness } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.harness";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

describe("DatasetFlowProcessCardComponent", () => {
    let component: DatasetFlowProcessCardComponent;
    let fixture: ComponentFixture<DatasetFlowProcessCardComponent>;

    const mockSummary = requireValue(
        mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes.allCards.nodes[0].summary,
    );

    function createCard(
        effectiveState: FlowProcessEffectiveState,
        options: {
            datasetBasics?: DatasetBasicsFragment;
            runningSince?: string;
        } = {},
    ): Promise<DatasetFlowProcessCardHarness> {
        fixture = TestBed.createComponent(DatasetFlowProcessCardComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", options.datasetBasics ?? mockDatasetBasicsRootFragment);
        setComponentInput(fixture, "summary", {
            ...mockSummary,
            effectiveState,
            runningSince: options.runningSince ?? null,
        });
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, DatasetFlowProcessCardHarness);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetFlowProcessCardComponent, SharedTestModule],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        registerMatSvgIcons();
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
    });

    afterEach(() => {
        timekeeper.reset();
    });

    it("should create", async () => {
        await createCard(FlowProcessEffectiveState.Active);
        expect(component).toBeTruthy();
    });

    it("should emit the dataset when 'Update now' is clicked", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active);
        const updateNowEmitterSpy = vi.spyOn(component.updateNowEmitter, "emit").mockImplementation(() => {});

        await card.clickUpdateNow();

        expect(updateNowEmitterSpy).toHaveBeenCalledTimes(1);

        expect(updateNowEmitterSpy).toHaveBeenCalledWith(mockDatasetBasicsRootFragment);
    });

    it("should emit the current state and dataset when the state toggle is clicked", async () => {
        const card = await createCard(FlowProcessEffectiveState.Failing);
        const toggleStateDatasetCardEmitterSpy = vi
            .spyOn(component.toggleStateDatasetCardEmitter, "emit")
            .mockImplementation(() => {});

        await card.clickToggleState();

        expect(toggleStateDatasetCardEmitterSpy).toHaveBeenCalledTimes(1);

        expect(toggleStateDatasetCardEmitterSpy).toHaveBeenCalledWith({
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
            expect(await card.isToggleStateDisabled()).toBe(false);
        });
    });

    it("should disable the state toggle for an unconfigured process", async () => {
        const card = await createCard(FlowProcessEffectiveState.Unconfigured);

        expect(await card.getStateText()).toEqual("UNCONFIGURED");
        expect(await card.isToggleStateDisabled()).toBe(true);
    });

    it("should show for how long the running flow has been running", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active, { runningSince: "2024-03-14T11:20:19+00:00" });
        expect(await card.getRunningDuration()).toEqual("2 minutes 10 seconds");
    });

    it("should not show a duration when no flow is running", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active);
        expect(await card.getRunningDuration()).toBeNull();
    });

    it("should link a root dataset to its scheduling settings", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active);
        expect(await card.getSettingsLinkHref()).toEqual(
            `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}/settings/${SettingsTabsEnum.SCHEDULING}`,
        );
    });

    it("should link a derivative dataset to its transform settings", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active, {
            datasetBasics: mockDatasetBasicsDerivedFragment,
        });
        expect(await card.getSettingsLinkHref()).toEqual(
            `/${mockDatasetBasicsDerivedFragment.owner.accountName}/${mockDatasetBasicsDerivedFragment.name}/settings/${SettingsTabsEnum.TRANSFORM_SETTINGS}`,
        );
    });

    it("should disable both buttons while an action is in progress", async () => {
        const card = await createCard(FlowProcessEffectiveState.Active);
        expect(await card.isUpdateNowDisabled()).toBe(false);
        expect(await card.isToggleStateDisabled()).toBe(false);

        setComponentInput(fixture, "actionInProgress", true);

        expect(await card.isUpdateNowDisabled()).toBe(true);
        expect(await card.isToggleStateDisabled()).toBe(true);
    });
});
