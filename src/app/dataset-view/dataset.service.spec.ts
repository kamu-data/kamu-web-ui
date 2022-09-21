/* eslint-disable @typescript-eslint/dot-notation */
import { DatasetInfo } from "./../interface/navigation.interface";
import { ApolloTestingModule } from "apollo-angular/testing";
import { TestBed } from "@angular/core/testing";
import { DatasetApi } from "../api/dataset.api";
import { ErrorService } from "../services/error.service";
import { AppDatasetService } from "./dataset.service";
import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { ModalService } from "../components/modal/modal.service";

describe("AppDatasetService", () => {
    let service: AppDatasetService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [
                ErrorService,
                DatasetApi,
                AppDatasetSubscriptionsService,
                ModalService,
            ],
        });
        service = TestBed.inject(AppDatasetService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be called getDatasetMainData method", async () => {
        const mockDatasetInfo: DatasetInfo = {
            accountName: "Test accountName",
            datasetName: "Test datasetName",
        };
        const getDatasetMainDataSpy: jasmine.Spy = spyOn(
            service["datasetApi"],
            "getDatasetMainData",
        ).and.callThrough();
        service.requestDatasetMainData(mockDatasetInfo);
        await expect(getDatasetMainDataSpy).toHaveBeenCalled();
    });
});
