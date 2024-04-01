import { TestBed } from "@angular/core/testing";
import { ProtocolsService } from "./protocols.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ProtocolsApi } from "../api/protocols.api";
import { of } from "rxjs";
import {
    mockDatasetEndPoints,
    mockDatasetProtocolsQuery,
} from "../components/data-access-panel/data-access-panel-mock.data";
import { mockDatasetInfo } from "../search/mock.data";
import { DatasetEndpoints } from "../api/kamu.graphql.interface";
import { MaybeUndefined } from "../common/app.types";

describe("ProtocolsService", () => {
    let service: ProtocolsService;
    let protocolsApi: ProtocolsApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(ProtocolsService);
        protocolsApi = TestBed.inject(ProtocolsApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get protocols", () => {
        const getProtocolsSpy = spyOn(protocolsApi, "getProtocols").and.returnValue(of(mockDatasetProtocolsQuery));

        const subscription$ = service
            .getProtocols(mockDatasetInfo)
            .subscribe((result: MaybeUndefined<DatasetEndpoints>) => {
                if (result) {
                    expect(result).toEqual(mockDatasetEndPoints);
                }
            });

        expect(getProtocolsSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });
});
