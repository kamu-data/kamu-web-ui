/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable, of, take } from "rxjs";

import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, DatasetKind, FlowProcessEffectiveState } from "@api/kamu.graphql.interface";

import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";

@Injectable({
    providedIn: "root",
})
export class ProcessDatasetCardInteractionService {
    private flowsService = inject(DatasetFlowsService);
    private modalService = inject(ModalService);
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public handleTrigger(datasetBasics: DatasetBasicsFragment, onSuccess: () => void): void {
        const datasetTrigger$ =
            datasetBasics.kind === DatasetKind.Root
                ? this.flowsService.datasetTriggerIngestFlow({ datasetId: datasetBasics.id })
                : this.flowsService.datasetTriggerTransformFlow({ datasetId: datasetBasics.id });

        const obs$ = datasetTrigger$.pipe(take(1));

        obs$.subscribe((success: boolean) => {
            if (success) {
                setTimeout(onSuccess, this.TIMEOUT_REFRESH_FLOW);
            }
        });
    }

    public handleToggleState(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
        onSuccess: () => void;
        confirmModal?: boolean;
    }): void {
        const { state, datasetBasics, onSuccess, confirmModal } = params;

        const executeToggle = () => {
            let operation$: Observable<void> = of();
            if ([FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing].includes(state)) {
                operation$ = this.flowsService.datasetPauseFlows({
                    datasetId: datasetBasics.id,
                });
            } else {
                operation$ = this.flowsService.datasetResumeFlows({
                    datasetId: datasetBasics.id,
                });
            }
            const obs$ = operation$.pipe(take(1));
            obs$.subscribe(() => {
                setTimeout(onSuccess, this.TIMEOUT_REFRESH_FLOW);
            });
        };

        if (confirmModal && state === FlowProcessEffectiveState.StoppedAuto) {
            promiseWithCatch(
                this.modalService.error({
                    title: "Resume updates",
                    message: "Have you confirmed that all issues have been resolved?",
                    yesButtonText: "Ok",
                    noButtonText: "Cancel",
                    handler: (ok) => {
                        ok && executeToggle();
                    },
                }),
            );
        } else {
            executeToggle();
        }
    }
}
