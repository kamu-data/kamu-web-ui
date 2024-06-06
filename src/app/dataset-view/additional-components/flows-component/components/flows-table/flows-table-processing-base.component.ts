import { Observable } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { FilterByInitiatorEnum, FlowsTableData } from "./flows-table.types";
import { DatasetBasicsFragment, FlowStatus } from "src/app/api/kamu.graphql.interface";
import { Directive, Input, inject } from "@angular/core";
import { DatasetFlowsService } from "../../services/dataset-flows.service";
import { NavigationService } from "src/app/services/navigation.service";

@Directive()
export abstract class FlowsTableProcessingBaseComponent extends BaseComponent {
    @Input() public datasetBasics: DatasetBasicsFragment;
    public tileWidgetData$: Observable<MaybeUndefined<FlowsTableData>>;
    public filterByStatus: MaybeNull<FlowStatus> = null;
    public filterByInitiator = FilterByInitiatorEnum.All;
    public readonly WIDGET_FLOW_RUNS_PER_PAGE: number = 150;
    public readonly TABLE_FLOW_RUNS_PER_PAGE: number = 15;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly TIMEOUT_REFRESH_FLOW = 800;

    protected flowsService = inject(DatasetFlowsService);
    protected navigationService = inject(NavigationService);
}
