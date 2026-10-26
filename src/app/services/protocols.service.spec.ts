/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { DatasetEndpointsDataFragment } from "@api/kamu.graphql.interface";
import { ProtocolsApi } from "@api/protocols.api";
import { MaybeUndefined } from "@interface/app.types";

import { mockDatasetEndPoints, mockDatasetProtocolsQuery } from "src/app/data-access-panel/data-access-panel-mock.data";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { ProtocolsService } from "src/app/services/protocols.service";

describe("ProtocolsService", () => {
    let service: ProtocolsService;
    let protocolsApi: ProtocolsApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(ProtocolsService);
        protocolsApi = TestBed.inject(ProtocolsApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get protocols", () => {
        const getProtocolsSpy = vi.spyOn(protocolsApi, "getProtocols").mockReturnValue(of(mockDatasetProtocolsQuery));

        const subscription$ = service
            .getProtocols(mockDatasetInfo)
            .subscribe((result: MaybeUndefined<DatasetEndpointsDataFragment>) => {
                expect(result).toEqual(mockDatasetEndPoints);
            });

        expect(getProtocolsSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });
});
