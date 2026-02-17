/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessStreamTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-stream-tab/data-access-stream-tab.component";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

describe("DataAccessStreamTabComponent", () => {
    let component: DataAccessStreamTabComponent;
    let fixture: ComponentFixture<DataAccessStreamTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessStreamTabComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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
