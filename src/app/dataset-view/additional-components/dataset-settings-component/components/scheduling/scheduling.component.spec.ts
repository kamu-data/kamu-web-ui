import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SchedulingComponent } from "./scheduling.component";
import { ApolloModule } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "../../../../../common/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

describe("SchedulingComponent", () => {
    let component: SchedulingComponent;
    let fixture: ComponentFixture<SchedulingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchedulingComponent],
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                SharedTestModule,
                MatDividerModule,
                MatRadioModule,
                MatSlideToggleModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SchedulingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("pollingGroup should change inputs disable state", () => {
        const form = component.schedulingForm;
        const pollingSource = form.get("pollingGroup.pollingSource") as AbstractControl;
        const timeDelta = form.get("pollingGroup.timeDelta") as AbstractControl;
        const timeSegment = form.get("pollingGroup.timeSegment") as AbstractControl;
        const cronExpression = form.get("pollingGroup.cronExpression") as AbstractControl;

        expect(timeDelta.disabled).toBeTruthy();
        expect(timeSegment.disabled).toBeTruthy();
        expect(cronExpression.disabled).toBeTruthy();

        pollingSource.setValue(component.pollingGroupEnum.TIME_DELTA);

        expect(timeDelta.enabled).toBeTruthy();
        expect(timeSegment.enabled).toBeTruthy();
        expect(cronExpression.disabled).toBeTruthy();

        pollingSource.setValue(component.pollingGroupEnum.CRON_EXPRESSION);

        expect(timeDelta.disabled).toBeTruthy();
        expect(timeSegment.disabled).toBeTruthy();
        expect(cronExpression.enabled).toBeTruthy();
    });

    it("throttlingGroup should change inputs disable state", () => {
        const form = component.schedulingForm;
        const throttlingParameters = form.get("throttlingGroup.throttlingParameters") as AbstractControl;
        const awaitFor = form.get("throttlingGroup.awaitFor") as AbstractControl;
        const awaitUntil = form.get("throttlingGroup.awaitUntil") as AbstractControl;

        expect(awaitFor.disabled).toBeTruthy();
        expect(awaitUntil.disabled).toBeTruthy();

        throttlingParameters.setValue(component.throttlingGroupEnum.AWAIT_FOR);

        expect(awaitFor.enabled).toBeTruthy();
        expect(awaitUntil.disabled).toBeTruthy();

        throttlingParameters.setValue(component.throttlingGroupEnum.AWAIT_UNTIL);

        expect(awaitFor.disabled).toBeTruthy();
        expect(awaitUntil.enabled).toBeTruthy();
    });
});
