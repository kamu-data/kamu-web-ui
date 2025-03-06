/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { ProtocolsApi } from "./protocols.api";
import { mockDatasetInfo } from "../search/mock.data";
import { DatasetProtocolsDocument, DatasetProtocolsQuery } from "./kamu.graphql.interface";
import { mockDatasetProtocolsQuery } from "../data-access-panel/data-access-panel-mock.data";

describe("ProtocolsApi", () => {
    let service: ProtocolsApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProtocolsApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(ProtocolsApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should get all supported protocols", fakeAsync(() => {
        expect(service).toBeTruthy();
        const subscription$ = service.getProtocols(mockDatasetInfo).subscribe((result: DatasetProtocolsQuery) => {
            expect(result.datasets.byOwnerAndName?.endpoints.webLink.url).toEqual(
                mockDatasetProtocolsQuery.datasets.byOwnerAndName?.endpoints.webLink.url,
            );
            expect(result.datasets.byOwnerAndName?.endpoints.cli.pullCommand).toEqual(
                mockDatasetProtocolsQuery.datasets.byOwnerAndName?.endpoints.cli.pullCommand,
            );
            expect(result.datasets.byOwnerAndName?.endpoints.cli.pushCommand).toEqual(
                mockDatasetProtocolsQuery.datasets.byOwnerAndName?.endpoints.cli.pushCommand,
            );
        });

        const op = controller.expectOne(DatasetProtocolsDocument);
        expect(op.operation.variables.accountName).toEqual(mockDatasetInfo.accountName);
        expect(op.operation.variables.datasetName).toEqual(mockDatasetInfo.datasetName);

        op.flush({
            data: mockDatasetProtocolsQuery,
        });
        tick();
        expect(subscription$.closed).toEqual(true);
        flush();
    }));
});
