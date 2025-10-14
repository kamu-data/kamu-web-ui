/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsAssociatedChannelsComponent } from "./flows-associated-channels.component";
import { Apollo } from "apollo-angular";
import { WebhookFlowSubProcessGroup } from "src/app/api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SubscriptionsTableComponent } from "./components/subscriptions-table/subscriptions-table.component";
import { provideToastr } from "ngx-toastr";

describe("FlowsAssociatedChannelsComponent", () => {
    let component: FlowsAssociatedChannelsComponent;
    let fixture: ComponentFixture<FlowsAssociatedChannelsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsAssociatedChannelsComponent, SubscriptionsTableComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(FlowsAssociatedChannelsComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.webhooksData = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes
            .webhooks as WebhookFlowSubProcessGroup;
        component.flowsSelectionState = {
            flowsCategory: undefined,
            webhooksCategory: undefined,
            webhookFilterButtons: [],
            webhooksIds: [],
            subscriptions: [],
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
