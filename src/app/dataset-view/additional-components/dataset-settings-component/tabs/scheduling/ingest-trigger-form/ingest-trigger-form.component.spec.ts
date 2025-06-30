/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { of } from "rxjs";
import {
    mockGetDatasetFlowTriggersQuery,
    mockGetDatasetFlowTriggersTimeDeltaQuery,
} from "src/app/api/mock/dataset-flow.mock";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setFieldValue,
} from "src/app/common/helpers/base-test.helpers.spec";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { PollingGroupEnum } from "../../../dataset-settings.model";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";
import { TimeDeltaFormModule } from "src/app/common/components/time-delta-form/time-delta-form.module";
import { CronExpressionFormModule } from "src/app/common/components/cron-expression-form/cron-expression-form.module";

describe("IngestTriggerFormComponent", () => {
    let component: IngestTriggerFormComponent;
    let fixture: ComponentFixture<IngestTriggerFormComponent>;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    const MOCK_INVALID_CRON_EXPRESSION = "* *";

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IngestTriggerFormComponent],
            providers: [Apollo],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                ToastrModule.forRoot(),
                MatRadioModule,
                SharedTestModule,
                MatSlideToggleModule,
                MatProgressBarModule,
                TooltipIconModule,
                TimeDeltaFormModule,
                CronExpressionFormModule,
            ],
        });
        fixture = TestBed.createComponent(IngestTriggerFormComponent);
        component = fixture.componentInstance;
        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);

        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.isLoaded = true;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init form with cron expression", fakeAsync(() => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersQuery),
        );
        fixture.detectChanges();

        tick(); // Wait for async operations
        fixture.detectChanges();

        const cronExpessionControl = findElementByDataTestId(fixture, "cron-expression-input") as HTMLInputElement;
        expect(cronExpessionControl.value.trim()).toEqual("* * * * ?");
    }));

    it("should check init form with time delta", fakeAsync(() => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();
        tick(); // Wait for async operations
        fixture.detectChanges();

        const everyControl = findElementByDataTestId(fixture, "time-delta-every") as HTMLInputElement;
        expect(everyControl.value.trim()).toEqual("10");
        const unitControl = findElementByDataTestId(fixture, "time-delta-unit") as HTMLInputElement;
        expect(unitControl.value.trim()).toEqual(TimeUnit.Minutes);
    }));

    it("should check switch polling options", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();
        component.pollingForm.patchValue({ updatesEnabled: true });
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cron-expression-form");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION);
        emitClickOnElementByDataTestId(fixture, "time-delta-form");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.TIME_DELTA);
    });

    it("should check cron expression error", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersTimeDeltaQuery),
        );
        fixture.detectChanges();
        component.pollingForm.patchValue({ updatesEnabled: true });
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cron-expression-form");
        expect(component.pollingType.value).toEqual(PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cron-expression-form");
        setFieldValue(fixture, "cron-expression-input", MOCK_INVALID_CRON_EXPRESSION);
        fixture.detectChanges();

        const errorMessageElem = findElementByDataTestId(fixture, "cron-expression-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Invalid expression");
    });
});
