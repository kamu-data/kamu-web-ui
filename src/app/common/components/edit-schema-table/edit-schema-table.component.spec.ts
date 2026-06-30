/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

import { EditSchemaTableComponent } from "./edit-schema-table.component";

describe("EditSchemaTableComponent", () => {
    let component: EditSchemaTableComponent;
    let fixture: ComponentFixture<EditSchemaTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditSchemaTableComponent],
            providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(EditSchemaTableComponent);
        component = fixture.componentInstance;
        component.hasTableHeader = true;
        component.dataRows = [];
        component.idTable = "test-schema-table";
        component.columnDescriptors = [{ columnName: "name" }, { columnName: "type" }];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
