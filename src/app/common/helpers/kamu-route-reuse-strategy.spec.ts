/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
    provideRouter,
    RouteReuseStrategy,
    Routes,
    withComponentInputBinding,
    withRouterConfig,
} from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";

import { routeSnapshot } from "@common/helpers/base-test.helpers.spec";
import { identityQueryParams, KamuRouteReuseStrategy } from "@common/helpers/kamu-route-reuse-strategy";
import { MaybeUndefined } from "@interface/app.types";

@Component({
    selector: "app-test-tab",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestTabComponent {
    @Input() public page: MaybeUndefined<string>;
}

@Component({
    selector: "app-test-other-tab",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestOtherTabComponent {}

// Shaped like the app's dataset routes: the path parameters sit on a parent without a component
const TEST_ROUTES: Routes = [
    {
        path: ":accountName/:datasetName",
        children: [
            { path: "tab", component: TestTabComponent },
            { path: "other", component: TestOtherTabComponent },
            { path: "editor", component: TestTabComponent, ...identityQueryParams("name") },
        ],
    },
];

describe("KamuRouteReuseStrategy", () => {
    describe("shouldReuseRoute", () => {
        const strategy = new KamuRouteReuseStrategy();

        it("should reuse a route whose parameters are the same", () => {
            expect(
                strategy.shouldReuseRoute(
                    routeSnapshot({ params: { accountName: "kamu", datasetName: "population" } }),
                    routeSnapshot({ params: { accountName: "kamu", datasetName: "population" } }),
                ),
            ).toBe(true);
        });

        it("should not reuse a route whose parameter has another value", () => {
            expect(
                strategy.shouldReuseRoute(
                    routeSnapshot({ params: { accountName: "kamu", datasetName: "population" } }),
                    routeSnapshot({ params: { accountName: "kamu", datasetName: "extra-14" } }),
                ),
            ).toBe(false);
        });

        it("should not reuse a route that gained a parameter", () => {
            expect(
                strategy.shouldReuseRoute(
                    routeSnapshot({ params: { accountName: "kamu", datasetName: "population" } }),
                    routeSnapshot({ params: { accountName: "kamu" } }),
                ),
            ).toBe(false);
        });

        it("should not reuse a route whose identity query parameter has another value", () => {
            expect(
                strategy.shouldReuseRoute(
                    routeSnapshot({ queryParams: { name: "b" }, data: identityQueryParams("name").data }),
                    routeSnapshot({ queryParams: { name: "a" }, data: identityQueryParams("name").data }),
                ),
            ).toBe(false);
        });

        it("should reuse a route whose other query parameters differ", () => {
            expect(
                strategy.shouldReuseRoute(
                    routeSnapshot({ queryParams: { name: "a", page: "2" }, data: identityQueryParams("name").data }),
                    routeSnapshot({ queryParams: { name: "a" }, data: identityQueryParams("name").data }),
                ),
            ).toBe(true);
        });

        it("should reuse a route whose query parameters alone differ", () => {
            expect(
                strategy.shouldReuseRoute(
                    routeSnapshot({ params: { accountName: "kamu" }, queryParams: { page: "2" } }),
                    routeSnapshot({ params: { accountName: "kamu" }, queryParams: { page: "1" } }),
                ),
            ).toBe(true);
        });
    });

    describe("in the router", () => {
        let harness: RouterTestingHarness;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                providers: [
                    provideRouter(
                        TEST_ROUTES,
                        withRouterConfig({ onSameUrlNavigation: "reload" }),
                        withComponentInputBinding(),
                    ),
                    { provide: RouteReuseStrategy, useClass: KamuRouteReuseStrategy },
                ],
            });
            harness = await RouterTestingHarness.create();
        });

        it("should build the page afresh for another dataset", async () => {
            const first = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);
            const second = await harness.navigateByUrl("/kamu/extra-14/tab", TestTabComponent);

            expect(second).not.toBe(first);
        });

        it("should build the page afresh for another account", async () => {
            const first = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);
            const second = await harness.navigateByUrl("/alice/population/tab", TestTabComponent);

            expect(second).not.toBe(first);
        });

        it("should keep the page when only its query parameters change, and bind the new ones", async () => {
            const first = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);
            const second = await harness.navigateByUrl("/kamu/population/tab?page=2", TestTabComponent);

            expect(second).toBe(first);
            expect(second.page).toEqual("2");
        });

        it("should keep the page when its URL is opened again", async () => {
            const first = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);
            const second = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);

            expect(second).toBe(first);
        });

        it("should build the page afresh when its identity query parameter changes", async () => {
            const first = await harness.navigateByUrl("/kamu/population/editor?name=a", TestTabComponent);
            const second = await harness.navigateByUrl("/kamu/population/editor?name=b", TestTabComponent);

            expect(second).not.toBe(first);
        });

        it("should build the page afresh when its identity query parameter appears", async () => {
            const first = await harness.navigateByUrl("/kamu/population/editor", TestTabComponent);
            const second = await harness.navigateByUrl("/kamu/population/editor?name=a", TestTabComponent);

            expect(second).not.toBe(first);
        });

        it("should keep the page when a query parameter other than its identity changes", async () => {
            const first = await harness.navigateByUrl("/kamu/population/editor?name=a", TestTabComponent);
            const second = await harness.navigateByUrl("/kamu/population/editor?name=a&page=2", TestTabComponent);

            expect(second).toBe(first);
            expect(second.page).toEqual("2");
        });

        it("should build the page afresh after leaving it for another tab", async () => {
            const first = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);
            await harness.navigateByUrl("/kamu/population/other", TestOtherTabComponent);
            const second = await harness.navigateByUrl("/kamu/population/tab", TestTabComponent);

            expect(second).not.toBe(first);
        });
    });
});
