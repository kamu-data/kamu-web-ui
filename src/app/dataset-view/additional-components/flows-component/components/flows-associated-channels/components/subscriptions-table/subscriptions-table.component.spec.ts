/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SubscriptionsTableComponent } from "./subscriptions-table.component";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";
import { WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";
import { provideToastr } from "ngx-toastr";

describe("SubscriptionsTableComponent", () => {
    let component: SubscriptionsTableComponent;
    let fixture: ComponentFixture<SubscriptionsTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SubscriptionsTableComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(SubscriptionsTableComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.subprocesses = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes.webhooks
            .subprocesses as WebhookFlowSubProcess[];
        component.webhookTableFilters = [];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
