import { CreateDatasetFromSnapshotMutation, CreateEmptyDatasetMutation } from "./../api/kamu.graphql.interface";
import { mockDatasetBasicsFragment, mockDatasetInfo } from "./../search/mock.data";
import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";
import { DatasetApi } from "../api/dataset.api";
import { DatasetKind } from "../api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { NavigationService } from "../services/navigation.service";
import { AppDatasetCreateService } from "./dataset-create.service";

describe("AppDatasetCreateService", () => {
    let service: AppDatasetCreateService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(AppDatasetCreateService);
        datasetApi = TestBed.inject(DatasetApi);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be create empty dataset with success", () => {
        const mockResponseSuccess: CreateEmptyDatasetMutation = {
            datasets: {
                createEmpty: {
                    message: "Success",
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        spyOn(datasetApi, "createEmptyDataset").and.returnValue(of(mockResponseSuccess));
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        service
            .createEmptyDataset(mockDatasetInfo.accountName, DatasetKind.Root, mockDatasetInfo.datasetName)
            .subscribe();

        expect(spyNavigateToDatasetView).toHaveBeenCalledWith({
            accountName: mockDatasetInfo.accountName,
            datasetName: mockDatasetInfo.datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should be create empty dataset with error", () => {
        const mockResponseError: CreateEmptyDatasetMutation = {
            datasets: {
                createEmpty: {
                    message: "Fail",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        spyOn(datasetApi, "createEmptyDataset").and.returnValue(of(mockResponseError));
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        service
            .createEmptyDataset(mockDatasetInfo.accountName, DatasetKind.Root, mockDatasetInfo.datasetName)
            .subscribe();

        expect(spyNavigateToDatasetView).not.toHaveBeenCalledWith({
            accountName: mockDatasetInfo.accountName,
            datasetName: mockDatasetInfo.datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
        service.onErrorMessageChanges.subscribe((error) => {
            expect(error).toBe("Fail");
        });
    });

    it("should be create dataset using shapshot with success", () => {
        const mockResponseSuccess: CreateDatasetFromSnapshotMutation = {
            datasets: {
                createFromSnapshot: {
                    message: "Success",
                    dataset: {
                        ...mockDatasetBasicsFragment,
                    },
                    __typename: "CreateDatasetResultSuccess",
                },
            },
        };
        spyOn(datasetApi, "createDatasetFromSnapshot").and.returnValue(of(mockResponseSuccess));
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        service.createDatasetFromSnapshot(mockDatasetInfo.accountName, "mockSnapshot").subscribe();

        expect(spyNavigateToDatasetView).toHaveBeenCalledWith({
            accountName: mockDatasetInfo.accountName,
            datasetName: mockDatasetBasicsFragment.name as string,
            tab: DatasetViewTypeEnum.Overview,
        });
    });

    it("should be create dataset using shapshot with error", () => {
        const mockResponseError: CreateDatasetFromSnapshotMutation = {
            datasets: {
                createFromSnapshot: {
                    message: "Fail",
                    __typename: "CreateDatasetResultNameCollision",
                },
            },
        };
        spyOn(datasetApi, "createDatasetFromSnapshot").and.returnValue(of(mockResponseError));
        const spyNavigateToDatasetView = spyOn(navigationService, "navigateToDatasetView");

        service.createDatasetFromSnapshot(mockDatasetInfo.accountName, "mockSnapshot").subscribe();

        expect(spyNavigateToDatasetView).not.toHaveBeenCalledWith({
            accountName: mockDatasetInfo.accountName,
            datasetName: mockDatasetBasicsFragment.name as string,
            tab: DatasetViewTypeEnum.Overview,
        });
        service.onErrorMessageChanges.subscribe((error) => {
            expect(error).toBe("Fail");
        });
    });
});
