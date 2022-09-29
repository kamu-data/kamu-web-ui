import {
    mockDatasetDataSqlRunResponse,
    mockDatasetHistoryResponse,
    mockDatasetMainDataResponse,
    mockInfo,
} from "./../search/mock.data";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockDatasetBasicsFragment } from "./../search/mock.data";
import { TestBed } from "@angular/core/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { DatasetApi } from "../api/dataset.api";
import { ModalService } from "../components/modal/modal.service";
import { AppDatasetService } from "./dataset.service";
import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    GetDatasetMainDataQuery,
} from "../api/kamu.graphql.interface";
import { of } from "rxjs";

describe("AppDatasetService", () => {
    let service: AppDatasetService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                DatasetApi,
                ModalService,
                AppDatasetService,
                AppDatasetSubscriptionsService,
                Apollo,
            ],
        });
        service = TestBed.inject(AppDatasetService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be call datasetChanges$.next", async () => {
        const datasetChanges$Spy = spyOn(service["datasetChanges$"], "next");
        service.datasetChanges(mockDatasetBasicsFragment);
        await expect(datasetChanges$Spy).toHaveBeenCalled();
        service.onDatasetChanges.subscribe((data) => {
            void expect(data).toEqual(mockDatasetBasicsFragment);
        });
    });

    it("should be check get main data from api", async () => {
        const getDatasetMainDataSpy = spyOn(
            service["datasetApi"],
            "getDatasetMainData",
        ).and.returnValue(of(mockDatasetMainDataResponse));
        service.requestDatasetMainData(mockInfo);
        await expect(getDatasetMainDataSpy).toHaveBeenCalled();
        service["datasetApi"]
            .getDatasetMainData(mockInfo)
            .subscribe((data: GetDatasetMainDataQuery) => {
                void expect(data).toEqual(mockDatasetMainDataResponse);
            });
    });

    it("should be check get history data from api", async () => {
        const numRecords = 7;
        const numPage = 1;
        const getDatasetHistorySpy = spyOn(
            service["datasetApi"],
            "getDatasetHistory",
        ).and.returnValue(of(mockDatasetHistoryResponse));
        service.requestDatasetHistory(mockInfo, numRecords, numPage);
        await expect(getDatasetHistorySpy).toHaveBeenCalled();
        service["datasetApi"]
            .getDatasetHistory({ ...mockInfo, numRecords, numPage })
            .subscribe((data: GetDatasetHistoryQuery) => {
                void expect(data).toEqual(mockDatasetHistoryResponse);
            });
    });

    it("should be check get SQL query data from api", async () => {
        const query = "select\n  *\nfrom testTable";
        const limit = 20;
        const getDatasetDataSqlRunSpy = spyOn(
            service["datasetApi"],
            "getDatasetDataSqlRun",
        ).and.returnValue(of(mockDatasetDataSqlRunResponse));
        service.requestDatasetDataSqlRun(query, limit);
        await expect(getDatasetDataSqlRunSpy).toHaveBeenCalled();
        service["datasetApi"]
            .getDatasetDataSqlRun({ query, limit })
            .subscribe((data: GetDatasetDataSqlRunQuery) => {
                void expect(data).toEqual(mockDatasetDataSqlRunResponse);
            });
    });
});
