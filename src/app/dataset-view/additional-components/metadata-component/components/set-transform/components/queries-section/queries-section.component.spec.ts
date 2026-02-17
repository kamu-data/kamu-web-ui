/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { QueriesSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/queries-section/queries-section.component";
import { EditorModule } from "src/app/editor/editor.module";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

describe("QueriesSectionComponent", () => {
    let component: QueriesSectionComponent;
    let fixture: ComponentFixture<QueriesSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QueriesSectionComponent, EditorModule],
        }).compileComponents();

        fixture = TestBed.createComponent(QueriesSectionComponent);
        component = fixture.componentInstance;
        component.queries = [
            { alias: "alias1", query: "query1" },
            { alias: "alias2", query: "query2" },
            { alias: "alias3", query: "query3" },
        ];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add default query", () => {
        expect(component.queries.length).toBe(3);
        emitClickOnElementByDataTestId(fixture, "set-transform-add-query");
        expect(component.queries.length).toBe(4);
    });

    it("should check delete query by index", () => {
        expect(component.queries.length).toBe(3);
        emitClickOnElementByDataTestId(fixture, "remove-query-1");
        expect(component.queries[1]).not.toEqual({
            alias: "alias2",
            query: "query2",
        });
        expect(component.queries.length).toBe(2);
    });

    it("should check move down query", () => {
        expect(component.queries[0].alias).toBe("alias1");
        expect(component.queries[1].alias).toBe("alias2");
        emitClickOnElementByDataTestId(fixture, "move-down-query-0");
        expect(component.queries[0].alias).toBe("alias2");
        expect(component.queries[1].alias).toBe("alias1");
    });

    it("should check move up query", () => {
        expect(component.queries[0].alias).toBe("alias1");
        expect(component.queries[1].alias).toBe("alias2");
        emitClickOnElementByDataTestId(fixture, "move-up-query-1");
        expect(component.queries[0].alias).toBe("alias2");
        expect(component.queries[1].alias).toBe("alias1");
    });
});
