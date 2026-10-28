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

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetOverviewFragment } from "@api/kamu.graphql.interface";

import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewWithSetInfo,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EditDetailsModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/edit-details-modal/edit-details-modal.component";
import { EditDetailsModalHarness } from "src/app/dataset-view/additional-components/overview-component/components/edit-details-modal/edit-details-modal.harness";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";

describe("EditDetailsModalComponent", () => {
    let component: EditDetailsModalComponent;
    let fixture: ComponentFixture<EditDetailsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EditDetailsModalComponent],
            providers: [Apollo, NgbActiveModal, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();
    });

    function openModal(overview: DatasetOverviewFragment): Promise<EditDetailsModalHarness> {
        fixture = TestBed.createComponent(EditDetailsModalComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsDerivedFragment);
        setComponentInput(fixture, "currentState", {
            schema: mockMetadataDerivedUpdate.schema,
            data: mockOverviewDataUpdate.content,
            overview,
            size: mockOverviewDataUpdate.size,
        });
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, EditDetailsModalHarness);
    }

    it("should create", async () => {
        await openModal(mockOverviewDataUpdate.overview);

        expect(component).toBeTruthy();
    });

    it("should check initialize details", async () => {
        const modal = await openModal(mockOverviewWithSetInfo);

        expect(await modal.getKeywords()).toEqual(["mock1", "mock2"]);
        expect(component.description).toEqual("mock description");
        expect(await modal.isSaveDisabled()).toBe(true);
    });

    it("should check commit event", async () => {
        const modal = await openModal(mockOverviewDataUpdate.overview);
        const commitSetInfoEventSpy = vi.spyOn(component, "commitSetInfoEvent").mockImplementation(() => {});

        await modal.addKeyword("keyword1");
        expect(await modal.isSaveDisabled()).toBe(false);
        await modal.save();

        expect(commitSetInfoEventSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add keyword", async () => {
        const modal = await openModal(mockOverviewDataUpdate.overview);
        expect(await modal.getKeywords()).toEqual([]);

        await modal.addKeyword("keyword1");

        expect(await modal.getKeywords()).toEqual(["keyword1"]);
        expect(await modal.getKeywordInputValue()).toBe("");
    });

    it("should trim a keyword", async () => {
        const modal = await openModal(mockOverviewDataUpdate.overview);

        await modal.addKeyword("  keyword1  ");

        expect(await modal.getKeywords()).toEqual(["keyword1"]);
    });

    it("should ignore a blank keyword", async () => {
        const modal = await openModal(mockOverviewDataUpdate.overview);

        await modal.addKeyword("   ");

        expect(await modal.getKeywords()).toEqual([]);
        expect(await modal.getKeywordInputValue()).toBe("");
        expect(await modal.isSaveDisabled()).toBe(true);
    });

    ["mock1", "MOCK1", " Mock2 "].forEach((keyword) => {
        it(`should not add "${keyword}", which the dataset has already in another letter case`, async () => {
            const modal = await openModal(mockOverviewWithSetInfo);

            await modal.addKeyword(keyword);

            expect(await modal.getKeywords()).toEqual(["mock1", "mock2"]);
            expect(await modal.getKeywordInputValue()).toBe("");
            expect(await modal.isSaveDisabled()).toBe(true);
        });
    });

    it("should check remove keyword", async () => {
        const modal = await openModal(mockOverviewDataUpdate.overview);
        await modal.addKeyword("keyword1");
        expect(await modal.getKeywords()).toEqual(["keyword1"]);

        await modal.removeKeyword("keyword1");

        expect(await modal.getKeywords()).toEqual([]);
    });
});
