/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { filter, map, Observable, of, take } from "rxjs";

import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { DatasetBasicsFragment, DatasetKind, FlowProcessEffectiveState } from "@api/kamu.graphql.interface";

import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";

@Injectable({
    providedIn: "root",
})
export class ProcessDatasetCardInteractionService {
    private flowsService = inject(DatasetFlowsService);
    private modalService = inject(ModalService);

    /** Emits once whether the flow was triggered */
    public handleTrigger(datasetBasics: DatasetBasicsFragment): Observable<boolean> {
        const datasetTrigger$ =
            datasetBasics.kind === DatasetKind.Root
                ? this.flowsService.datasetTriggerIngestFlow({ datasetId: datasetBasics.id })
                : this.flowsService.datasetTriggerTransformFlow({ datasetId: datasetBasics.id });

        return datasetTrigger$.pipe(take(1));
    }

    /**
     * Emits once when pausing or resuming may go ahead: resuming an auto-stopped process asks first.
     * A cancel completes without a value; a confirmation closed with Escape never answers.
     */
    public confirmToggleState(state: FlowProcessEffectiveState): Observable<void> {
        if (state === FlowProcessEffectiveState.StoppedAuto) {
            return this.confirmResume().pipe(
                filter(Boolean),
                map(() => undefined),
            );
        }
        return of(undefined);
    }

    /** Pauses or resumes the dataset's flows without asking, and emits once they are toggled */
    public handleToggleState(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): Observable<void> {
        const { state, datasetBasics } = params;
        const toggle$ = [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing].includes(state)
            ? this.flowsService.datasetPauseFlows({ datasetId: datasetBasics.id })
            : this.flowsService.datasetResumeFlows({ datasetId: datasetBasics.id });
        return toggle$.pipe(take(1));
    }

    private confirmResume(): Observable<boolean> {
        return new Observable<boolean>((subscriber) => {
            promiseWithCatch(
                this.modalService.error({
                    title: "Resume updates",
                    message: "Have you confirmed that all issues have been resolved?",
                    yesButtonText: "Ok",
                    noButtonText: "Cancel",
                    handler: (ok) => {
                        subscriber.next(Boolean(ok));
                        subscriber.complete();
                    },
                }),
            );
        });
    }
}
