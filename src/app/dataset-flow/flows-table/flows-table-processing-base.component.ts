/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectorRef, Directive, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { Observable } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import { requireValue } from "@common/helpers/app.helpers";
import AppValues from "@common/values/app.values";
import { AccountFragment, FlowStatus, InitiatorFilterInput } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import {
    CancelFlowArgs,
    FlowsTableData,
    FlowsTableFiltersOptions,
} from "src/app/dataset-flow/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Directive()
export abstract class FlowsTableProcessingBaseComponent extends BaseComponent {
    protected readonly WIDGET_FLOW_RUNS_PER_PAGE: number = 150;
    protected readonly TABLE_FLOW_RUNS_PER_PAGE: number = 15;
    protected readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    protected readonly flowsService = inject(DatasetFlowsService);
    protected readonly navigationService = inject(NavigationService);
    protected readonly cdr = inject(ChangeDetectorRef);

    protected filterByStatus: MaybeNull<FlowStatus[]> = [FlowStatus.Finished];
    protected filterInitiator: MaybeNull<InitiatorFilterInput> = null;
    public onlySystemFlows = false;
    public searchByAccount: AccountFragment[] = [];
    public currentPage = 1;

    protected tileWidgetData$: Observable<MaybeUndefined<FlowsTableData>>;

    protected abstract fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus[]>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
        datasetsIds?: string[],
    ): void;

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public onAbortFlow(params: CancelFlowArgs): void {
        const datasetId: string = requireValue(
            params.datasetId,
            "Aborting flows without datasetId is not supported yet",
        );
        this.flowsService
            .cancelFlowRun({
                datasetId,
                flowId: params.flowId,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    setTimeout(() => {
                        this.refreshFlow();
                        this.cdr.detectChanges();
                    }, this.TIMEOUT_REFRESH_FLOW);
                }
            });
    }

    public refreshFlow(): void {
        this.fetchTableData(this.currentPage, this.filterByStatus, this.filterInitiator);
        this.cdr.detectChanges();
    }

    protected searchByFilters(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        this.filterByStatus = filters?.status?.length ? filters.status : null;
        this.onlySystemFlows = filters?.onlySystemFlows ?? false;
        this.searchByAccount = filters?.accounts ?? [];
        if (!filters) {
            this.onlySystemFlows = false;
        } else {
            const { accounts, onlySystemFlows } = filters;
            this.filterInitiator = onlySystemFlows
                ? { system: true }
                : accounts.length
                  ? {
                        accounts: accounts.map((item: AccountFragment) => item.id),
                    }
                  : null;
        }
    }
}
