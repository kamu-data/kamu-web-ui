/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SubscriptionsTableComponent } from "./subscriptions-table.component";
import { Apollo } from "apollo-angular";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { mockDatasetFlowsProcessesQuery, mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { DatasetFlowProcesses } from "src/app/api/kamu.graphql.interface";
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
        component.flowsData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        };
        component.flowConnectionData = {
            flowsData: mockFlowsTableData,
            flowInitiators: [],
            flowProcesses: mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses,
        };
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
