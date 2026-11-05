/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TestBed } from "@angular/core/testing";

import { PageLoadFailedComponent } from "@common/components/page-load-failed/page-load-failed.component";
import { PageLoadFailedHarness } from "@common/components/page-load-failed/page-load-failed.harness";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";

import { NavigationService } from "src/app/services/navigation.service";

describe("PageLoadFailedComponent", () => {
    let harness: PageLoadFailedHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [PageLoadFailedComponent],
        });
        const fixture = TestBed.createComponent(PageLoadFailedComponent);
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PageLoadFailedHarness);
    });

    it("should say that the page could not be loaded", async () => {
        expect(await harness.getTitle()).toEqual("Something went wrong");
        expect(await harness.getDescription()).toEqual(
            "This page could not be loaded. Check your connection and try again.",
        );
    });

    it("should reload the requested page on try again", async () => {
        const reloadPageSpy = stubMethod(TestBed.inject(NavigationService), "reloadPage");

        await harness.clickTryAgain();

        expect(reloadPageSpy).toHaveBeenCalledTimes(1);
    });
});
