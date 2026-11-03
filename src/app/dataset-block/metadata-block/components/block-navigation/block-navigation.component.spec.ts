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

import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { BlockNavigationComponent } from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.component";
import { BlockNavigationHarness } from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.harness";
import {
    MOCK_BLOCK_HASH_A,
    MOCK_BLOCK_HASH_B,
    MOCK_NO_BLOCK_LIST_FILTER,
    mockBlockListHistory,
} from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.mock";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";

describe("BlockNavigationComponent", () => {
    let component: BlockNavigationComponent;
    let fixture: ComponentFixture<BlockNavigationComponent>;
    let harness: BlockNavigationHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockNavigationComponent, SharedTestModule],
            providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockNavigationComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetInfo", MOCK_DATASET_INFO);
        setComponentInput(fixture, "currentBlockHash", MOCK_BLOCK_HASH_A);
        setComponentInput(fixture, "datasetHistory", mockBlockListHistory);
        setComponentInput(fixture, "filter", MOCK_NO_BLOCK_LIST_FILTER);
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BlockNavigationHarness);
    });

    it("should list the blocks it is given, with no highlight", async () => {
        expect(await harness.getBlockHashes()).toEqual([MOCK_BLOCK_HASH_A, MOCK_BLOCK_HASH_B]);
        expect(await harness.getHighlightedHashParts()).toEqual([null, null]);
    });

    it("should offer the event types the page can show", async () => {
        expect(await harness.getEventTypeOptions()).toEqual(Object.values(SupportedEvents));
    });

    it("should request the selected event types at once", async () => {
        const filterChangeSpy = stubMethod(component.filterChange, "emit");

        await harness.selectEventType(SupportedEvents.SetTransform);
        await harness.selectEventType(SupportedEvents.ExecuteTransform);

        expect(filterChangeSpy).toHaveBeenLastCalledWith({
            eventTypes: [SupportedEvents.SetTransform, SupportedEvents.ExecuteTransform],
            hashPrefix: "",
        });
    });

    it("should request a valid hash prefix once the user stops typing, trimmed", async () => {
        const filterChangeSpy = stubMethod(component.filterChange, "emit");

        await harness.typeHashPrefix(" F1620B7 ");

        expect(filterChangeSpy).toHaveBeenCalledTimes(1);
        expect(filterChangeSpy).toHaveBeenCalledWith({ eventTypes: [], hashPrefix: "F1620B7" });
        expect(await harness.getHashError()).toBeNull();
    });

    it("should highlight the searched prefix in the hashes that start with it, in any case", async () => {
        await harness.typeHashPrefix("F1620B7");

        expect(await harness.getHighlightedHashParts()).toEqual([null, MOCK_BLOCK_HASH_B.slice(0, 7)]);
        expect(await harness.getBlockHashes()).toEqual([MOCK_BLOCK_HASH_A, MOCK_BLOCK_HASH_B]);
    });

    it("should reject a prefix the backend can't parse and keep the last valid filter", async () => {
        const filterChangeSpy = stubMethod(component.filterChange, "emit");

        await harness.typeHashPrefix("1620");
        await harness.selectEventType(SupportedEvents.Seed);

        expect(await harness.getHashError()).toEqual("Block hash must start with f followed by hex digits");
        expect(filterChangeSpy).not.toHaveBeenCalled();

        await harness.typeHashPrefix("f16g");
        expect(await harness.getHashError()).toEqual("Block hash must start with f followed by hex digits");

        await harness.clearHashPrefix();
        expect(filterChangeSpy).toHaveBeenCalledTimes(1);
        expect(filterChangeSpy).toHaveBeenCalledWith({ eventTypes: [SupportedEvents.Seed], hashPrefix: "" });
        expect(await harness.getHashPrefix()).toBe("");
        expect(await harness.getHashError()).toBeNull();
    });

    it("should not request again when the filter returns to the one shown", async () => {
        const filterChangeSpy = stubMethod(component.filterChange, "emit");

        await harness.typeHashPrefix("x");
        await harness.clearHashPrefix();

        expect(filterChangeSpy).not.toHaveBeenCalled();
    });

    it("should show the filter the URL holds", async () => {
        setComponentInput(fixture, "filter", { eventTypes: [SupportedEvents.Seed], hashPrefix: "f1620b7" });

        expect(await harness.getSelectedEventTypes()).toEqual([SupportedEvents.Seed]);
        expect(await harness.getHashPrefix()).toBe("f1620b7");
        expect(await harness.getHashError()).toBeNull();
        expect(await harness.getHighlightedHashParts()).toEqual([null, MOCK_BLOCK_HASH_B.slice(0, 7)]);
    });

    it("should say what is wrong with a malformed prefix from the URL", async () => {
        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "xyz" });

        expect(await harness.getHashPrefix()).toBe("xyz");
        expect(await harness.getHashError()).toEqual("Block hash must start with f followed by hex digits");
    });

    it("should keep the hash error in step with back and forward", async () => {
        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "xyz" });
        expect(await harness.getHashError()).toEqual("Block hash must start with f followed by hex digits");

        await harness.clearHashPrefix();
        expect(await harness.getHashError()).toBeNull();

        // Back to the address with the malformed prefix
        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "xyz" });
        expect(await harness.getHashPrefix()).toBe("xyz");
        expect(await harness.getHashError()).toEqual("Block hash must start with f followed by hex digits");

        // Forward to one with a valid prefix
        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "f1620" });
        expect(await harness.getHashPrefix()).toBe("f1620");
        expect(await harness.getHashError()).toBeNull();
    });

    it("should keep what the user typed since when the URL brings back an emitted filter late", async () => {
        const filterChangeSpy = stubMethod(component.filterChange, "emit");
        await harness.typeHashPrefix("f1620");
        await harness.typeHashPrefix("f1620b");
        expect(filterChangeSpy).toHaveBeenLastCalledWith({ eventTypes: [], hashPrefix: "f1620b" });

        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "f1620" });
        expect(await harness.getHashPrefix()).toBe("f1620b");

        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "f1620b" });
        expect(await harness.getHashPrefix()).toBe("f1620b");

        // Going back in history is a filter the form did not emit, so it shows
        setComponentInput(fixture, "filter", { eventTypes: [], hashPrefix: "f1620" });
        expect(await harness.getHashPrefix()).toBe("f1620");
    });

    it("should keep the filter and page in the links to other blocks", async () => {
        const filter = { eventTypes: [SupportedEvents.AddData, SupportedEvents.Seed], hashPrefix: "f1620" };
        setComponentInput(fixture, "filter", filter);
        setComponentInput(fixture, "datasetHistory", {
            ...mockBlockListHistory,
            pageInfo: { ...mockBlockListHistory.pageInfo, currentPage: 1 },
        });

        const [link] = await harness.getBlockLinks();
        expect(link).toContain(`/${MOCK_BLOCK_HASH_A}?`);
        expect(link).toContain("eventTypes=AddData,Seed");
        expect(link).toContain("hashPrefix=f1620");
        expect(link).toContain("page=2");
    });

    it("should lead back from a page past the last one", async () => {
        setComponentInput(fixture, "datasetHistory", {
            history: [],
            pageInfo: { ...mockBlockListHistory.pageInfo, currentPage: 5 },
        });

        expect(await harness.isPagePastEndShown()).toBe(true);
        expect(await harness.isNoBlockMatchesShown()).toBe(false);
    });

    it("should say no block matches on a later page of a filter that matches nothing", async () => {
        setComponentInput(fixture, "datasetHistory", {
            history: [],
            pageInfo: { ...mockBlockListHistory.pageInfo, currentPage: 2, totalPages: 0 },
        });

        expect(await harness.isNoBlockMatchesShown()).toBe(true);
        expect(await harness.isPagePastEndShown()).toBe(false);
    });

    it("should say no block matches when the filtered page is empty", async () => {
        expect(await harness.isNoBlockMatchesShown()).toBe(false);

        setComponentInput(fixture, "datasetHistory", { ...mockBlockListHistory, history: [] });

        expect(await harness.isNoBlockMatchesShown()).toBe(true);
    });

    it("should check change page number", () => {
        const testPage = 2;
        const onPageChangeEmitSpy = stubMethod(component.onPageChangeEmit, "emit");
        component.onPageChange(testPage);

        expect(onPageChangeEmitSpy).toHaveBeenCalledWith(testPage);
    });
});
