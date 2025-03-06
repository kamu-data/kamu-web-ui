/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditWatermarkModalComponent } from "./edit-watermark-modal.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { FormsModule } from "@angular/forms";
import timekeeper from "timekeeper";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { of } from "rxjs";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";

describe("EditWatermarkModalComponent", () => {
    let component: EditWatermarkModalComponent;
    let fixture: ComponentFixture<EditWatermarkModalComponent>;
    let datasetCommitService: DatasetCommitService;
    let loggedUserService: LoggedUserService;
    const FROZEN_TIME = new Date("2022-10-01 12:00:00");

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditWatermarkModalComponent],
            providers: [Apollo, NgbActiveModal],
            imports: [
                MatDividerModule,
                MatIconModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                OwlMomentDateTimeModule,
                FormsModule,
                SharedTestModule,
                HttpClientTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditWatermarkModalComponent);
        component = fixture.componentInstance;
        datasetCommitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    beforeAll(() => {
        timekeeper.freeze(FROZEN_TIME);
    });

    it("should check init date when currentWatermark is null", () => {
        const result = new Date();
        fixture.detectChanges();
        expect(component.date).toEqual(result);
    });

    it("should check init minLocalWatermark when currentWatermark is not null", () => {
        (component.currentWatermark = "2023-03-12T00:00:00+00:00"), fixture.detectChanges();
        const result = "2023-03-12T00:00:00.000Z";
        expect(component.minLocalWatermark).toEqual(result);
    });

    it("should check commit SetWatermark event", () => {
        fixture.detectChanges();
        const commitSetWatermarkEventSpy = spyOn(component, "commitSetWatermarkEvent").and.callThrough();
        spyOn(datasetCommitService, "updateWatermark").and.returnValue(of());
        emitClickOnElementByDataTestId(fixture, "commit-setWatermark-event");
        expect(commitSetWatermarkEventSpy).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
        timekeeper.reset();
    });
});
