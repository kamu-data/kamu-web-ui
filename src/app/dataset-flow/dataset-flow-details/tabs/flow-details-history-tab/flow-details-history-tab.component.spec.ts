/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsHistoryTabComponent } from "./flow-details-history-tab.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockFlowHistoryDataFragment, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("FlowDetailsHistoryTabComponent", () => {
    let component: FlowDetailsHistoryTabComponent;
    let fixture: ComponentFixture<FlowDetailsHistoryTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatDividerModule,
                MatIconModule,
                ApolloModule,
                ApolloTestingModule,
                SharedTestModule,
                HttpClientTestingModule,
                FlowDetailsHistoryTabComponent,
            ],
            providers: [Apollo],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowDetailsHistoryTabComponent);
        component = fixture.componentInstance;
        component.response = {
            flow: mockFlowSummaryDataFragments[2],
            flowHistory: mockFlowHistoryDataFragment,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
