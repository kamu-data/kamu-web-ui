/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, Data, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

import RoutingResolvers from "../../../../../common/resolvers/routing-resolvers";
import { flowDetailsSummaryResolverFn } from "./flow-details-summary.resolver";

describe("flowDetailsSummaryResolverFn", () => {
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<DatasetFlowByIdResponse | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsSummaryResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
        });
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should return flow details data from parent route", () => {
        const mockRoute = {
            parent: {
                data: {
                    [RoutingResolvers.FLOW_DETAILS_KEY]: mockDatasetFlowByIdResponse,
                } as Data,
            },
        } as ActivatedRouteSnapshot;

        const result = executeResolver(mockRoute, mockState);

        expect(result).toBe(mockDatasetFlowByIdResponse);
        expect(result).toEqual(mockDatasetFlowByIdResponse);
    });

    describe("should return null when no data is available", () => {
        const testCases = [
            {
                description: "parent route has no data",
                mockRoute: {
                    parent: {
                        data: {} as Data,
                    },
                } as ActivatedRouteSnapshot,
            },
            {
                description: "parent route data is null",
                mockRoute: {
                    parent: {
                        data: {
                            [RoutingResolvers.FLOW_DETAILS_KEY]: null,
                        } as Data,
                    },
                } as ActivatedRouteSnapshot,
            },
            {
                description: "parent route is null",
                mockRoute: {
                    parent: null,
                } as ActivatedRouteSnapshot,
            },
            {
                description: "parent route is undefined",
                mockRoute: {} as ActivatedRouteSnapshot,
            },
        ];

        testCases.forEach(({ description, mockRoute }) => {
            it(`when ${description}`, () => {
                const result = executeResolver(mockRoute, mockState);
                expect(result).toBeNull();
            });
        });
    });
});
