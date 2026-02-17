/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { DatasetInfo } from "@interface/navigation.interface";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
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
        component.yamlTemplate = "test yaml";
        component.datasetInfo = testDatasetInfo;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should save event", () => {
        const commitEventToDatasetSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());
        const closeModalSpy = spyOn(activeModal, "close");

        emitClickOnElementByDataTestId(fixture, "save-event");

        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
        expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });
});
