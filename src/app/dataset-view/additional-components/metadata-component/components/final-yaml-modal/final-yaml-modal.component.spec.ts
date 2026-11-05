/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NEVER, of, throwError } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { captureUnhandledRxjsErrors, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { DatasetInfo } from "@interface/navigation.interface";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import { FinalYamlModalHarness } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.harness";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";

const testDatasetInfo: DatasetInfo = {
    accountName: "testAccountName",
    datasetName: "testDatasetName",
};

describe("FinalYamlModalComponent", () => {
    let component: FinalYamlModalComponent;
    let fixture: ComponentFixture<FinalYamlModalComponent>;
    let datasetCommitService: DatasetCommitService;
    let activeModal: NgbActiveModal;
    let loggedUserService: LoggedUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, NgbActiveModal],
            imports: [SharedTestModule, FinalYamlModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        activeModal = TestBed.inject(NgbActiveModal);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "yamlTemplate", "test yaml");
        setComponentInput(fixture, "datasetInfo", testDatasetInfo);
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    function finalYamlHarness(): Promise<FinalYamlModalHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, FinalYamlModalHarness);
    }

    it("should save the event and close with its YAML", async () => {
        const commitEventToDatasetSpy = vi
            .spyOn(datasetCommitService, "commitEventToDataset")
            .mockReturnValue(of(true));
        const closeModalSpy = stubMethod(activeModal, "close");
        const modal = await finalYamlHarness();

        await modal.save();

        expect(commitEventToDatasetSpy).toHaveBeenCalledWith(expect.objectContaining({ event: "test yaml" }));
        expect(closeModalSpy).toHaveBeenCalledWith("test yaml");
    });

    it("should close with its YAML when the backend refuses the event, so the page can offer it again", async () => {
        vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(of(false));
        const closeModalSpy = stubMethod(activeModal, "close");
        const modal = await finalYamlHarness();

        await modal.save();

        expect(closeModalSpy).toHaveBeenCalledWith("test yaml");
    });

    it("should stay open with the YAML entered when the commit request fails", async () => {
        const unhandledErrors = captureUnhandledRxjsErrors();
        vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(
            throwError(() => new Error("Server unreachable")),
        );
        const closeModalSpy = stubMethod(activeModal, "close");
        const modal = await finalYamlHarness();

        await modal.save();

        expect(closeModalSpy).not.toHaveBeenCalled();
        expect(component.yamlTemplate).toBe("test yaml");
        expect(await modal.isSaveDisabled()).toBe(false);
        await vi.waitFor(() => expect(unhandledErrors).toHaveBeenCalledWith(new Error("Server unreachable")));
    });

    it("should keep Save disabled while the event is being committed", async () => {
        const commitEventToDatasetSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(NEVER);
        const modal = await finalYamlHarness();

        await modal.save();
        await modal.save();

        expect(await modal.isSaveDisabled()).toBe(true);
        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
    });
});
