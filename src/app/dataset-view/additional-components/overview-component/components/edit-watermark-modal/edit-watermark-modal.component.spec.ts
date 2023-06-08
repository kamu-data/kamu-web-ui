import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditWatermarkModalComponent } from "./edit-watermark-modal.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import {
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
} from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { FormsModule } from "@angular/forms";
import timekeeper from "timekeeper";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { of } from "rxjs";

describe("EditWatermarkModalComponent", () => {
    let component: EditWatermarkModalComponent;
    let fixture: ComponentFixture<EditWatermarkModalComponent>;
    let appDatasetCreateService: AppDatasetCreateService;
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
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditWatermarkModalComponent);
        component = fixture.componentInstance;
        appDatasetCreateService = TestBed.inject(AppDatasetCreateService);
        component.datasetBasics = mockDatasetBasicsFragment;
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

    it("should check init date when currentWatermark is defined", () => {
        const result = "mock_value";
        component.currentWatermark = result;
        component.ngOnInit();
        expect(component.date).toEqual(result);
    });

    it("should check commit SetWatermark event", () => {
        fixture.detectChanges();
        const commitSetWatermarkEventSpy = spyOn(
            component,
            "commitSetWatermarkEvent",
        ).and.callThrough();
        spyOn(appDatasetCreateService, "commitEventToDataset").and.returnValue(
            of(),
        );
        emitClickOnElementByDataTestId(fixture, "commit-setWatermark-event");
        expect(commitSetWatermarkEventSpy).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
        timekeeper.reset();
    });
});
