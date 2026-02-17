/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { of } from "rxjs";

import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { EditWatermarkModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/edit-watermark-modal/edit-watermark-modal.component";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import timekeeper from "timekeeper";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails } from "@api/mock/auth.mock";

describe("EditWatermarkModalComponent", () => {
    let component: EditWatermarkModalComponent;
    let fixture: ComponentFixture<EditWatermarkModalComponent>;
    let datasetCommitService: DatasetCommitService;
    let loggedUserService: LoggedUserService;
    const FROZEN_TIME = new Date("2022-10-01 12:00:00");

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                OwlMomentDateTimeModule,
                SharedTestModule,
                EditWatermarkModalComponent,
                BrowserAnimationsModule,
            ],
            providers: [
                Apollo,
                NgbActiveModal,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
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
        component.currentWatermark = "2023-03-12T00:00:00+00:00";
        fixture.detectChanges();
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

    it("should check to show a datepicker", () => {
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "fromdatepicker");
        fixture.detectChanges();
        const datepicker = fixture.debugElement.query(By.css(".owl-dt-popup-container"));
        expect(datepicker).toBeDefined();
    });

    afterAll(() => {
        timekeeper.reset();
    });
});
