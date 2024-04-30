import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import {
    FilterByInitiatorEnum,
    FlowsTableData,
} from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsTabComponent extends BaseComponent implements OnInit {
    public tileWidgetData$: Observable<MaybeUndefined<FlowsTableData>>;
    public nodes: FlowSummaryDataFragment[] = [mockFlowSummaryDataFragments[0]];
    public filterByStatus: MaybeNull<FlowStatus> = null;
    public filterByInitiator = FilterByInitiatorEnum.All;
    public searchByAccountName = "";
    public currentPage = 1;

    constructor(
        private flowsService: DatasetFlowsService,
        private router: Router,
        private navigationService: NavigationService,
        private cdr: ChangeDetectorRef,
        private datasetSubsService: DatasetSubscriptionsService,
    ) {
        super();
    }

    ngOnInit(): void {}
}
