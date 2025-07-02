/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlQueryViewerComponent } from "./sql-query-viewer.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SqlQueryViewerComponent", () => {
    let component: SqlQueryViewerComponent;
    let fixture: ComponentFixture<SqlQueryViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SqlQueryViewerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SqlQueryViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
