/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsTransformOptionsTabComponent } from "./dataset-settings-transform-options-tab.component";
import { MatDividerModule } from "@angular/material/divider";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { BatchingFormType } from "./dataset-settings-transform-options-tab.component.types";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("DatasetSettingsTransformOptionsTabComponent", () => {
    let component: DatasetSettingsTransformOptionsTabComponent;
    let fixture: ComponentFixture<DatasetSettingsTransformOptionsTabComponent>;
    let datasetSchedulingService: DatasetSchedulingService;

    const MOCK_MIN_RECORDS_TO_AWAIT = 40;
    const MOCK_PARAM_EVERY = 10;
    const MOCK_PARAM_UNIT = TimeUnit.Minutes;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [
                ApolloTestingModule,
                SharedTestModule,
                MatDividerModule,
                DatasetSettingsTransformOptionsTabComponent,
            ],
        });
        fixture = TestBed.createComponent(DatasetSettingsTransformOptionsTabComponent);
        datasetSchedulingService = TestBed.inject(DatasetSchedulingService);
        component = fixture.componentInstance;
        component.transformViewData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check 'Save triger' button works for DERIVATIVE dataset", () => {
        const setDatasetFlowBatchingSpy = spyOn(datasetSchedulingService, "setDatasetTriggers").and.callThrough();
        const mockBatchingTriggerForm = new FormGroup<BatchingFormType>({
            updatesState: new FormControl<boolean>(false, { nonNullable: true }),
            every: new FormControl<MaybeNull<number>>({ value: MOCK_PARAM_EVERY, disabled: false }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: MOCK_PARAM_UNIT, disabled: false }, [
                Validators.required,
            ]),
            minRecordsToAwait: new FormControl<MaybeNull<number>>(
                { value: MOCK_MIN_RECORDS_TO_AWAIT, disabled: false },
                [Validators.required, Validators.min(1)],
            ),
        });

        component.saveBatchingTriggers(mockBatchingTriggerForm);

        expect(setDatasetFlowBatchingSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                triggerInput: {
                    batching: {
                        minRecordsToAwait: MOCK_MIN_RECORDS_TO_AWAIT,
                        maxBatchingInterval: {
                            every: MOCK_PARAM_EVERY,
                            unit: MOCK_PARAM_UNIT,
                        },
                    },
                },
            }),
        );
    });
});
