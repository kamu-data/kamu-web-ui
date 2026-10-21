/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TestBed } from "@angular/core/testing";

import { LoginUnavailableComponent } from "@common/components/login-unavailable/login-unavailable.component";
import { LoginUnavailableHarness } from "@common/components/login-unavailable/login-unavailable.harness";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";

describe("LoginUnavailableComponent", () => {
    async function createHarness(supportEmail: MaybeUndefined<string>): Promise<LoginUnavailableHarness> {
        spyOnProperty(TestBed.inject(AppConfigService), "supportEmail", "get").and.returnValue(supportEmail);
        const fixture = TestBed.createComponent(LoginUnavailableComponent);
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, LoginUnavailableHarness);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LoginUnavailableComponent],
        });
    });

    it("should explain that sign-in is unavailable", async () => {
        const harness = await createHarness(undefined);
        expect(await harness.getTitle()).toEqual("Sign-in is unavailable");
    });

    it("should link to the configured support email", async () => {
        const harness = await createHarness("support@example.com");
        expect(await harness.getSupportLinkHref()).toEqual("mailto:support@example.com");
    });

    it("should not offer a contact link without a support email", async () => {
        const harness = await createHarness(undefined);
        expect(await harness.getSupportLinkHref()).toBeNull();
    });
});
