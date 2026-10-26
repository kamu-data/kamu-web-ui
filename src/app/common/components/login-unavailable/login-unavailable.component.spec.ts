/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { LoginUnavailableComponent } from "@common/components/login-unavailable/login-unavailable.component";
import { LoginUnavailableHarness } from "@common/components/login-unavailable/login-unavailable.harness";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("LoginUnavailableComponent", () => {
    async function createHarness(
        supportEmail: MaybeUndefined<string>,
        loadFailed: boolean = false,
    ): Promise<LoginUnavailableHarness> {
        vi.spyOn(TestBed.inject(AppConfigService), "supportEmail", "get").mockReturnValue(supportEmail);
        vi.spyOn(TestBed.inject(LoginMethodsService), "loadFailed", "get").mockReturnValue(loadFailed);
        const fixture = TestBed.createComponent(LoginUnavailableComponent);
        fixture.detectChanges();
        return TestbedHarnessEnvironment.harnessForFixture(fixture, LoginUnavailableHarness);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LoginUnavailableComponent],
            providers: [Apollo],
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

    describe("when no sign-in method is enabled", () => {
        it("should say so and ask to contact the administrator", async () => {
            const harness = await createHarness("support@example.com");
            expect(await harness.getDescription()).toEqual(
                "This Kamu node is available to signed-in users only, but no sign-in method is enabled on it right now. Please contact the administrator.",
            );
        });

        it("should name the node administrator without a support email", async () => {
            const harness = await createHarness(undefined);
            expect(await harness.getDescription()).toEqual(
                "This Kamu node is available to signed-in users only, but no sign-in method is enabled on it right now. Please contact the administrator of this node.",
            );
        });

        it("should not offer to try again", async () => {
            const harness = await createHarness(undefined);
            expect(await harness.hasTryAgainButton()).toBe(false);
        });
    });

    describe("when the sign-in methods could not be loaded", () => {
        it("should say the server could not be reached and link to the support email", async () => {
            const harness = await createHarness("support@example.com", true);
            expect(await harness.getTitle()).toEqual("Sign-in is unavailable");
            expect(await harness.getDescription()).toEqual(
                "Sign-in options could not be loaded because the server could not be reached. Try again later or contact the administrator.",
            );
            expect(await harness.getSupportLinkHref()).toEqual("mailto:support@example.com");
        });

        it("should name the node administrator without a support email", async () => {
            const harness = await createHarness(undefined, true);
            expect(await harness.getDescription()).toEqual(
                "Sign-in options could not be loaded because the server could not be reached. Try again later or contact the administrator of this node.",
            );
            expect(await harness.getSupportLinkHref()).toBeNull();
        });

        it("should reload the page on try again", async () => {
            const reloadSpy = vi.spyOn(TestBed.inject(NavigationService), "reloadPage").mockImplementation(() => {});
            const harness = await createHarness(undefined, true);

            expect(await harness.hasTryAgainButton()).toBe(true);
            await harness.clickTryAgain();

            expect(reloadSpy).toHaveBeenCalledTimes(1);
        });
    });
});
