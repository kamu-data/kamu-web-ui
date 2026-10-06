/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { FlowDownstreamLinkDataFragment } from "@api/kamu.graphql.interface";
import { mockFlowDownstreamLinks } from "@api/mock/dataset-flow.mock";

import { FlowDetailsDownstreamFlowsComponent } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/components/flow-details-downstream-flows/flow-details-downstream-flows.component";
import { FlowDetailsDownstreamFlowsHarness } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/components/flow-details-downstream-flows/flow-details-downstream-flows.component.harness";

describe("FlowDetailsDownstreamFlowsComponent", () => {
    let fixture: ComponentFixture<FlowDetailsDownstreamFlowsComponent>;
    let harness: FlowDetailsDownstreamFlowsHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlowDetailsDownstreamFlowsComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    async function setupComponent(links: FlowDownstreamLinkDataFragment[]) {
        fixture = TestBed.createComponent(FlowDetailsDownstreamFlowsComponent);
        fixture.componentRef.setInput("links", links);
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowDetailsDownstreamFlowsHarness);
    }

    it("should render nothing when there are no downstream flows", async () => {
        await setupComponent([]);

        expect(await harness.getTitle()).toBeNull();
        expect(await harness.getRows()).toEqual([]);
    });

    it("should render downstream flows ordered by activation time and flow ID", async () => {
        await setupComponent(mockFlowDownstreamLinks);

        expect(await harness.getTitle()).toEqual("Initiated 3 downstream flows:");
        const rows = await harness.getRows();
        expect(rows.map((row) => row.flowLabel)).toEqual(["Flow #10", "Flow #11", "Flow #12"]);
    });

    it("should link a visible downstream flow and its dataset", async () => {
        await setupComponent(mockFlowDownstreamLinks);

        const row = (await harness.getRows())[0];
        expect(row.icon).toEqual("check_circle");
        expect(row.iconClasses).toContain("completed-status");
        expect(row.flowHref).toEqual("/kamu/mockNameDerived/flow-details/10/history");
        expect(row.status).toEqual("Execute transformation finished");
        expect(row.datasetLabel).toEqual("kamu/mockNameDerived");
        expect(row.datasetHref).toEqual("/kamu/mockNameDerived");
        expect(row.unavailableDataset).toBeNull();
    });

    it("should not link a downstream flow hidden from the user, but link its dataset", async () => {
        await setupComponent(mockFlowDownstreamLinks);

        const row = (await harness.getRows())[1];
        expect(row.icon).toEqual("radio_button_unchecked");
        expect(row.flowHref).toBeNull();
        expect(row.status).toBeNull();
        expect(row.datasetHref).toEqual("/kamu/mockNameDerived");
    });

    it("should show only the ID of an unavailable downstream dataset", async () => {
        await setupComponent(mockFlowDownstreamLinks);

        const row = (await harness.getRows())[2];
        expect(row.icon).toEqual("help_outline");
        expect(row.flowHref).toBeNull();
        expect(row.status).toBeNull();
        expect(row.datasetHref).toBeNull();
        expect(row.unavailableDataset).toEqual("did:odf:fed...cbfee02 (unavailable)");
    });

    it("should not show a dataset for a downstream flow without one", async () => {
        await setupComponent([{ ...mockFlowDownstreamLinks[0], datasetId: null, dataset: null }]);

        const row = (await harness.getRows())[0];
        expect(row.flowLabel).toEqual("Flow #12");
        expect(row.datasetHref).toBeNull();
        expect(row.unavailableDataset).toBeNull();
    });
});
