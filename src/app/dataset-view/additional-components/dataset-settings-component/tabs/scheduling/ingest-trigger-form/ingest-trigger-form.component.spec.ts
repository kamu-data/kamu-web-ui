/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setFieldValue,
} from "src/app/common/helpers/base-test.helpers.spec";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { ScheduleType } from "../../../dataset-settings.model";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatRadioButtonHarness } from "@angular/material/radio/testing";
import { HarnessLoader } from "@angular/cdk/testing";

describe("IngestTriggerFormComponent", () => {
    let component: IngestTriggerFormComponent;
    let fixture: ComponentFixture<IngestTriggerFormComponent>;
    let loader: HarnessLoader;

    const MOCK_INVALID_CRON_EXPRESSION = "* *";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                IngestTriggerFormComponent,
            ],
        });
        fixture = TestBed.createComponent(IngestTriggerFormComponent);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);

        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.updateStateToggleLabel = "Enable automatic updates";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init form with cron expression", fakeAsync(() => {
        component.form.setValue({
            updatesEnabled: true,
            __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
            timeDelta: null,
            cron: { cronExpression: "* * * * ?" },
        });
        fixture.detectChanges();

        const cronExpessionControl = findElementByDataTestId(fixture, "cron-expression-input") as HTMLInputElement;
        expect(cronExpessionControl.value.trim()).toEqual("* * * * ?");
    }));

    it("should check init form with time delta", fakeAsync(() => {
        component.form.setValue({
            updatesEnabled: true,
            __typename: ScheduleType.TIME_DELTA,
            timeDelta: { every: 10, unit: TimeUnit.Minutes },
            cron: null,
        });

        fixture.detectChanges();

        const everyControl = findElementByDataTestId(fixture, "time-delta-every") as HTMLInputElement;
        expect(everyControl.value.trim()).toEqual("10");
        const unitControl = findElementByDataTestId(fixture, "time-delta-unit") as HTMLInputElement;
        expect(unitControl.value.trim()).toEqual(TimeUnit.Minutes);
    }));

    it("should check switch polling options", async () => {
        component.form.patchValue({ updatesEnabled: true, __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION });
        fixture.detectChanges();

        // First verify initial state
        expect(component.scheduleType.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        // Click on time delta radio button
        const timeDeltaRadio: MatRadioButtonHarness = await loader.getHarness(
            MatRadioButtonHarness.with({ selector: '[data-test-id="trigger-time-delta"]' }),
        );
        await timeDeltaRadio.check();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.scheduleType.value).toEqual(ScheduleType.TIME_DELTA);

        // Click on CRON radio button
        const cronRadio: MatRadioButtonHarness = await loader.getHarness(
            MatRadioButtonHarness.with({ selector: '[data-test-id="trigger-cron"]' }),
        );
        await cronRadio.check();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.scheduleType.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);
    });

    it("should check cron expression error", () => {
        component.form.patchValue({ updatesEnabled: true, __typename: ScheduleType.TIME_DELTA });
        fixture.detectChanges();

        // Click on cron expression radio button
        emitClickOnElementByDataTestId(fixture, "cron-expression-form");
        fixture.detectChanges();
        expect(component.scheduleType.value).toEqual(ScheduleType.CRON_5_COMPONENT_EXPRESSION);

        // Set invalid cron expression
        setFieldValue(fixture, "cron-expression-input", MOCK_INVALID_CRON_EXPRESSION);
        fixture.detectChanges();

        const errorMessageElem = findElementByDataTestId(fixture, "cron-expression-error");
        expect(errorMessageElem?.textContent?.trim()).toEqual("Invalid expression");
    });
});
