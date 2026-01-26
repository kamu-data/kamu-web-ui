/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessStreamTabComponent } from "./data-access-stream-tab.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("DataAccessStreamTabComponent", () => {
    let component: DataAccessStreamTabComponent;
    let fixture: ComponentFixture<DataAccessStreamTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [DataAccessStreamTabComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessStreamTabComponent);
        component = fixture.componentInstance;
        component.kafka = mockDatasetEndPoints.kafka;
        component.websocket = mockDatasetEndPoints.websocket;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
