/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloModule } from "apollo-angular";
import { FinalYamlModalComponent } from "./final-yaml-modal.component";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { of } from "rxjs";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";

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
            providers: [NgbActiveModal],
            imports: [ApolloModule, SharedTestModule, FinalYamlModalComponent],
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
