/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand } from "@angular/router";

import { map, Observable, of, switchMap } from "rxjs";

import {
    DatasetFlowType,
    FlowTriggerDataFragment,
    FlowTriggerStopPolicyDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeNullOrUndefined } from "@interface/app.types";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";
import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export interface FlowTriggerTabData extends DatasetViewData {
    paused: boolean;
    stopPolicy: MaybeNull<FlowTriggerStopPolicyDataFragment>;
}

/**
 * Like `resolveSettingsTabAccess`, then loads the dataset's trigger for `flowType`. Emits the
 * dataset with the trigger's paused flag and stop policy, plus the fields `pickRule` takes from
 * the trigger; a dataset without a trigger reads as paused, with no stop policy. A redirect passes
 * through without loading the trigger. Call it from a resolver.
 */
export function requestFlowTriggerTabData<TRule extends object>(
    tab: SettingsTabsEnum,
    flowType: DatasetFlowType,
    pickRule: (trigger: MaybeNullOrUndefined<FlowTriggerDataFragment>) => TRule,
): Observable<(FlowTriggerTabData & TRule) | RedirectCommand> {
    const datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    return resolveSettingsTabAccess(tab).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            return datasetFlowTriggerService.fetchDatasetFlowTrigger(data.datasetBasics.id, flowType).pipe(
                map((query) => {
                    const trigger = query.datasets.byId?.flows.triggers.byType;
                    return {
                        datasetBasics: data.datasetBasics,
                        datasetPermissions: data.datasetPermissions,
                        paused: trigger?.paused ?? true,
                        stopPolicy: trigger?.stopPolicy ?? null,
                        ...pickRule(trigger),
                    };
                }),
            );
        }),
    );
}
