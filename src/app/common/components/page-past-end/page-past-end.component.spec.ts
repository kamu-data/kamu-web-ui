/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PagePastEndComponent } from "@common/components/page-past-end/page-past-end.component";
import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";

describe("PagePastEndComponent", () => {
    let fixture: ComponentFixture<PagePastEndComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PagePastEndComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PagePastEndComponent);
        setComponentInput(fixture, "itemsName", "datasets");
    });

    async function harnessWithTotalPages(totalPages: PagePastEndComponent["totalPages"]): Promise<PagePastEndHarness> {
        setComponentInput(fixture, "totalPages", totalPages);
        return TestbedHarnessEnvironment.harnessForFixture(fixture, PagePastEndHarness);
    }

    it("should name what is missing from the page", async () => {
        const harness = await harnessWithTotalPages(3);
        expect(await harness.getMessage()).toEqual("There are no datasets on this page.");
    });

    it("should lead to the last page", async () => {
        const harness = await harnessWithTotalPages(3);
        const pageChangeSpy = vi.spyOn(fixture.componentInstance.pageChangeEvent, "emit");
        await harness.goToLastPage();
        expect(pageChangeSpy).toHaveBeenCalledWith(3);
    });

    [0, null, undefined].forEach((totalPages) => {
        it(`should lead to the first page when the total is ${totalPages}`, async () => {
            const harness = await harnessWithTotalPages(totalPages);
            const pageChangeSpy = vi.spyOn(fixture.componentInstance.pageChangeEvent, "emit");
            await harness.goToLastPage();
            expect(pageChangeSpy).toHaveBeenCalledWith(1);
        });
    });
});
