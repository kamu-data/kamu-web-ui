import { TestBed } from "@angular/core/testing";
import { DatasetSettingsService } from "./dataset-settings.service";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "src/app/api/dataset.api";
import { NavigationService } from "src/app/services/navigation.service";
import { of } from "rxjs";
import {
    mockErrorDeleteDatasetMutation,
    mockRenameResultNameCollision,
    mockRenameResultNoChanges,
    mockSuccessDeleteDatasetMutation,
    mockSuccessRenameDatasetMutation,
} from "../../data-tabs.mock";
import { ModalService } from "src/app/components/modal/modal.service";

describe("DatasetSettingsService", () => {
    let service: DatasetSettingsService;
    let datasetApi: DatasetApi;
    let navigationService: NavigationService;
    let modalService: ModalService;
    const DATASET_ID = "mockDatasetId";
    const NEW_NAME = "mock-dataset-name";
    const ACCOUNT_NAME = "accountName";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(DatasetSettingsService);
        navigationService = TestBed.inject(NavigationService);
        datasetApi = TestBed.inject(DatasetApi);
        modalService = TestBed.inject(ModalService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check detete dataset with succes", () => {
        const deleteDatasetSpy = spyOn(datasetApi, "deleteDataset").and.returnValue(
            of(mockSuccessDeleteDatasetMutation),
        );
        const navigateToSearchSpy = spyOn(navigationService, "navigateToSearch");
        service.deleteDataset(DATASET_ID).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(navigateToSearchSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check detete dataset with fail", () => {
        const errorSpy = spyOn(modalService, "error").and.callThrough();
        const deleteDatasetSpy = spyOn(datasetApi, "deleteDataset").and.returnValue(of(mockErrorDeleteDatasetMutation));
        service.deleteDataset(DATASET_ID).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check rename dataset with success", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const deleteDatasetSpy = spyOn(datasetApi, "renameDataset").and.returnValue(
            of(mockSuccessRenameDatasetMutation),
        );
        service.renameDataset(ACCOUNT_NAME, DATASET_ID, NEW_NAME).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check rename dataset with name collision", () => {
        const errorRenameDatasetChangesSpy = spyOn(service, "errorRenameDatasetChanges").and.callThrough();
        const deleteDatasetSpy = spyOn(datasetApi, "renameDataset").and.returnValue(of(mockRenameResultNameCollision));
        service.renameDataset(ACCOUNT_NAME, DATASET_ID, NEW_NAME).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(errorRenameDatasetChangesSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should check rename dataset with no changes", () => {
        const errorSpy = spyOn(modalService, "error").and.callThrough();
        const deleteDatasetSpy = spyOn(datasetApi, "renameDataset").and.returnValue(of(mockRenameResultNoChanges));
        service.renameDataset(ACCOUNT_NAME, DATASET_ID, NEW_NAME).subscribe(() => {
            expect(deleteDatasetSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy).toHaveBeenCalledTimes(1);
        });
    });
});
