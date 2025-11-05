/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountService } from "src/app/account/account.service";
import { Observable, switchMap, timer } from "rxjs";
import {
    AccountFlowProcessCardConnectionDataFragment,
    FlowProcessOrderField,
    OrderingDirection,
} from "src/app/api/kamu.graphql.interface";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { requireValue } from "src/app/common/helpers/app.helpers";

@Component({
    selector: "app-account-flows-datasets-subtab",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./account-flows-datasets-subtab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsDatasetsSubtabComponent implements OnInit {
    @Input({ required: true }) public accountName: string;

    private readonly accountService = inject(AccountService);
    private readonly activatedRoute = inject(ActivatedRoute);

    public accountFlowsCardsData$: Observable<AccountFlowProcessCardConnectionDataFragment>;
    public currentPage: number = 1;
    protected readonly CARDS_FLOW_RUNS_PER_PAGE: number = 10;

    public ngOnInit(): void {
        this.fetchCardsData(this.currentPage);
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public fetchCardsData(page: number): void {
        this.accountFlowsCardsData$ = timer(0, environment.delay_polling_ms).pipe(
            switchMap(() =>
                this.accountService.getAccountFlowsAsCards({
                    accountName: this.accountName,
                    page,
                    perPage: this.CARDS_FLOW_RUNS_PER_PAGE,
                    filters: { effectiveStateIn: [] },
                    ordering: { field: FlowProcessOrderField.EffectiveState, direction: OrderingDirection.Asc },
                }),
            ),
        );
    }
}
