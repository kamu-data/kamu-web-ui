/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SetPollingSourceEventComponent } from "./components/set-polling-source-event/set-polling-source-event.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { EventDetailsComponent } from "./event-details.component";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("EventDetailsComponent", () => {
    let component: EventDetailsComponent;
    let fixture: ComponentFixture<EventDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventDetailsComponent, SetPollingSourceEventComponent],
            imports: [SharedTestModule],
            providers: [Apollo, DatasetApi],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(EventDetailsComponent);
        component = fixture.componentInstance;
        component.block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        component.datasetInfo = { accountName: "accountName", datasetName: "datasetName" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
