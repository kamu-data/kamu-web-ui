import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetCommitService } from "./dataset-commit.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "src/app/api/dataset.api";
import { of } from "rxjs";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";
import { DatasetByAccountAndDatasetNameQuery } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import {
    mockCommitEventToDatasetMutation,
    mockCommitEventToDatasetMutationError,
    mockUpdateReadmeMutation,
} from "../../data-tabs.mock";

describe("DatasetCommitService", () => {
    let service: DatasetCommitService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;

    const TEST_ACCOUNT_NAME = "accountName";
    const TEST_DATASET_NAME = "datasetName";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        datasetApi = TestBed.inject(DatasetApi);
        navigationService = TestBed.inject(NavigationService);
        service = TestBed.inject(DatasetCommitService);
        spyOn(
            datasetApi,
            "getDatasetInfoByAccountAndDatasetName",
        ).and.returnValue(
            of(
                mockDatasetMainDataResponse as DatasetByAccountAndDatasetNameQuery,
            ),
        );
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check getIdByAccountNameAndDatasetName() method with cache", fakeAsync(() => {
        const key = TEST_ACCOUNT_NAME + TEST_DATASET_NAME;
        service.datasetIdsByAccountDatasetName.set(key, "testId");
        service
            .getIdByAccountNameAndDatasetName(
                TEST_ACCOUNT_NAME,
                TEST_DATASET_NAME,
            )
            .subscribe((data) => {
                expect(data).toEqual("testId");
                tick();
            });
        flush();
    }));

    it("should check getIdByAccountNameAndDatasetName() method without cache", fakeAsync(() => {
        service
            .getIdByAccountNameAndDatasetName(
                TEST_ACCOUNT_NAME,
                TEST_DATASET_NAME,
            )
            .subscribe((data) => {
                expect(data).toEqual(
                    mockDatasetMainDataResponse.datasets.byOwnerAndName
                        ?.id as string,
                );
                tick();
            });
        flush();
    }));

    it("should check commitEventToDataset() method", fakeAsync(() => {
        spyOn(datasetApi, "commitEvent").and.returnValue(
            of(mockCommitEventToDatasetMutation),
        );
        const navigationServiceSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        service
            .commitEventToDataset(
                TEST_ACCOUNT_NAME,
                TEST_DATASET_NAME,
                "contentEvent",
            )
            .subscribe(() => {
                expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
                tick();
            });
    }));

    it("should check commitEventToDataset() method with error", fakeAsync(() => {
        const errorCommitEventChangesSpy = spyOn(
            service,
            "errorCommitEventChanges",
        );
        spyOn(datasetApi, "commitEvent").and.returnValue(
            of(mockCommitEventToDatasetMutationError),
        );
        service
            .commitEventToDataset(
                TEST_ACCOUNT_NAME,
                TEST_DATASET_NAME,
                "contentEvent",
            )
            .subscribe(() => {
                expect(errorCommitEventChangesSpy).toHaveBeenCalledTimes(1);
                tick();
            });
        flush();
    }));

    it("should check updateReadme() method ", fakeAsync(() => {
        const navigationServiceSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        spyOn(datasetApi, "updateReadme").and.returnValue(
            of(mockUpdateReadmeMutation),
        );
        service
            .updateReadme(
                TEST_ACCOUNT_NAME,
                TEST_DATASET_NAME,
                "readme content",
            )
            .subscribe(() => {
                expect(navigationServiceSpy).toHaveBeenCalledTimes(1);
                tick();
            });
        flush();
    }));
});
