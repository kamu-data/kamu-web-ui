/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetFlowProcessCardComponent } from "./dataset-flow-process-card.component";

describe("DatasetFlowProcessCardComponent", () => {
    let component: DatasetFlowProcessCardComponent;
    let fixture: ComponentFixture<DatasetFlowProcessCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetFlowProcessCardComponent],
        });
        fixture = TestBed.createComponent(DatasetFlowProcessCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
