/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsBlockActionsComponent } from "./flows-block-actions.component";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetFlowProcess } from "src/app/api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("FlowsBlockActionsComponent", () => {
    let component: FlowsBlockActionsComponent;
    let fixture: ComponentFixture<FlowsBlockActionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsBlockActionsComponent, SharedTestModule, HttpClientTestingModule],
            providers: [Apollo, provideToastr()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(FlowsBlockActionsComponent);
        component = fixture.componentInstance;
        (component.datasetBasics = mockDatasetBasicsRootFragment),
            (component.flowProcess = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes
                .primary as DatasetFlowProcess);
        component.hasPushSources = false;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
