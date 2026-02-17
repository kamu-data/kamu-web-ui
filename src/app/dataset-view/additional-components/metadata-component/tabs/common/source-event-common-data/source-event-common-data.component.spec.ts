/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { SetPollingSourceEventFragment } from "@api/kamu.graphql.interface";

import { mockOverviewDataUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SourceEventCommonDataComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/common/source-event-common-data/source-event-common-data.component";

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
