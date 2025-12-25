/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SourceEventCommonDataComponent } from "./source-event-common-data.component";
import { mockOverviewDataUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SetPollingSourceEventFragment } from "src/app/api/kamu.graphql.interface";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "src/app/common/helpers/app.helpers";
import { provideToastr } from "ngx-toastr";

describe("SourceEventCommonDataComponent", () => {
    let component: SourceEventCommonDataComponent;
    let fixture: ComponentFixture<SourceEventCommonDataComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SourceEventCommonDataComponent, SharedTestModule],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER, provideToastr()],
        });
        fixture = TestBed.createComponent(SourceEventCommonDataComponent);
        component = fixture.componentInstance;
        component.sourceEvent = structuredClone(mockOverviewDataUpdate.overview).metadata
            .currentPollingSource as SetPollingSourceEventFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
