import { Observable } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { CancelFlowArgs, FlowsTableData, FlowsTableFiltersOptions } from "./flows-table.types";
import { AccountFragment, FlowStatus, InitiatorFilterInput } from "src/app/api/kamu.graphql.interface";
import { ChangeDetectorRef, Directive, inject } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Directive()
export abstract class FlowsTableProcessingBaseComponent extends BaseComponent {
    protected tileWidgetData$: Observable<MaybeUndefined<FlowsTableData>>;
    protected filterByStatus: MaybeNull<FlowStatus> = null;
    protected onlySystemFlows = false;
    protected searchByAccount: AccountFragment[] = [];
    protected currentPage = 1;
    protected readonly WIDGET_FLOW_RUNS_PER_PAGE: number = 150;
    protected readonly TABLE_FLOW_RUNS_PER_PAGE: number = 15;
    protected readonly FlowStatus: typeof FlowStatus = FlowStatus;
    protected readonly TIMEOUT_REFRESH_FLOW = 800;
    protected flowConnectionData$: Observable<{
        flowsData: FlowsTableData;
        allFlowsPaused: MaybeUndefined<boolean>;
        flowInitiators: AccountFragment[];
    }>;

    protected flowsService = inject(DatasetFlowsService);
    protected navigationService = inject(NavigationService);
    protected cdr = inject(ChangeDetectorRef);

    protected abstract fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
        datasetsIds?: string[],
    ): void;

    protected getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    protected onCancelFlow(params: CancelFlowArgs): void {
        this.flowsService
            .cancelScheduledTasks({
                datasetId: params.datasetId,
                flowId: params.flowId,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    setTimeout(() => {
                        this.refreshFlow();
                    }, this.TIMEOUT_REFRESH_FLOW);
                }
            });
    }

    protected refreshFlow(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
    }

    protected searchByFilters(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        this.filterByStatus = filters?.status ?? null;
        this.onlySystemFlows = filters?.onlySystemFlows ?? false;
        this.searchByAccount = filters?.accounts ?? [];
        if (!filters) {
            this.fetchTableData(this.currentPage, null, null, []);
            this.onlySystemFlows = false;
        } else {
            const { accounts, datasets, status, onlySystemFlows } = filters;
            const filterInitiatorOptions: MaybeNull<InitiatorFilterInput> = onlySystemFlows
                ? { system: true }
                : accounts.length
                  ? {
                        accounts: accounts.map((item: AccountFragment) => item.id),
                    }
                  : null;

            this.fetchTableData(
                this.currentPage,
                status,
                filterInitiatorOptions,
                datasets && datasets.length ? datasets.map((item) => item.id) : [],
            );
        }
    }
}
