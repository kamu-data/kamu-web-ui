/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-settings-scheduling-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatRadioModule } from "@angular/material/radio";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { TimeDelta, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { PollingGroupType } from "./dataset-settings-scheduling-tab.component.types";
import { MaybeNull } from "src/app/interface/app.types";
import { PollingGroupEnum } from "../../dataset-settings.model";
import { cronExpressionValidator } from "src/app/common/helpers/data.helpers";

describe("DatasetSettingsSchedulingTabComponent", () => {
    let component: DatasetSettingsSchedulingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSchedulingTabComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    const MOCK_PARAM_EVERY = 10;
    const MOCK_PARAM_UNIT = TimeUnit.Minutes;
    const MOCK_CRON_EXPRESSION = "* * * * ?";
    const MOCK_INPUT_TIME_DELTA: TimeDelta = {
        every: MOCK_PARAM_EVERY,
        unit: MOCK_PARAM_UNIT,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                SharedTestModule,
                MatDividerModule,
                MatSlideToggleModule,
                MatRadioModule,
                ReactiveFormsModule,
                DatasetSettingsSchedulingTabComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsSchedulingTabComponent);
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);

        component = fixture.componentInstance;
        component.schedulungTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check 'Save' button works for ROOT dataset with time delta", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();

        const mockPollingTriggerForm = new FormGroup<PollingGroupType>({
            updatesState: new FormControl<boolean>(true, { nonNullable: true }),
            __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            every: new FormControl<MaybeNull<number>>({ value: MOCK_PARAM_EVERY, disabled: false }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: MOCK_PARAM_UNIT, disabled: false }, [
                Validators.required,
            ]),
            cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
        });
        component.pollingForm = mockPollingTriggerForm;

        component.saveScheduledUpdates();

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        timeDelta: MOCK_INPUT_TIME_DELTA,
                    },
                },
            }),
        );
    });

    it("should check 'Save' button works for ROOT dataset with cron expression", () => {
        const setDatasetFlowScheduleSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();

        const mockPollingTriggerForm = new FormGroup<PollingGroupType>({
            updatesState: new FormControl<boolean>(true, { nonNullable: true }),
            __typename: new FormControl(PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION, [Validators.required]),
            every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
            cronExpression: new FormControl<MaybeNull<string>>({ value: MOCK_CRON_EXPRESSION, disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
        });
        component.pollingForm = mockPollingTriggerForm;

        component.saveScheduledUpdates();

        expect(setDatasetFlowScheduleSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    schedule: {
                        cron5ComponentExpression: `${MOCK_CRON_EXPRESSION}`,
                    },
                },
            }),
        );
    });
});
