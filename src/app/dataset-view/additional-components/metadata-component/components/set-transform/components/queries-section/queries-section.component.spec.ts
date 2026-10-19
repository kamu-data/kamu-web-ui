/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
    checkButtonDisabled,
    checkInputDisabled,
    checkVisible,
    emitClickOnElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";

import { QueriesSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/queries-section/queries-section.component";
import { EditorModule } from "src/app/editor/editor.module";

describe("QueriesSectionComponent", () => {
    let component: QueriesSectionComponent;
    let fixture: ComponentFixture<QueriesSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QueriesSectionComponent, EditorModule],
        }).compileComponents();

        fixture = TestBed.createComponent(QueriesSectionComponent);
        component = fixture.componentInstance;
    });

    // Renders once per test: replacing the queries after the first render disposes Monaco editors
    // that are still loading, which Monaco reports as uncaught "Canceled" errors
    function render(queries: QueriesSectionComponent["queries"]): void {
        component.queries = queries;
        fixture.detectChanges();
    }

    describe("with three queries", () => {
        beforeEach(() => {
            render([
                { alias: "alias1", query: "query1" },
                { alias: "alias2", query: "query2" },
                { alias: "alias3", query: "query3" },
            ]);
        });

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        it("should check add default query", () => {
            expect(component.queries.length).toBe(3);
            emitClickOnElementByDataTestId(fixture, "set-transform-add-query");
            expect(component.queries.length).toBe(4);
        });

        it("should check new query is added first and the output query stays last", () => {
            emitClickOnElementByDataTestId(fixture, "set-transform-add-query");
            fixture.detectChanges();

            expect(component.queries[0]).toEqual({ alias: "", query: "" });
            expect(component.queries[3]).toEqual({ alias: "alias3", query: "query3" });
            checkVisible(fixture, "query-output-badge-3", true);
            checkVisible(fixture, "query-output-badge-2", false);
        });

        it("should check only the last query is the output", async () => {
            await fixture.whenStable();

            checkInputDisabled(fixture, "query-alias-0", false);
            checkInputDisabled(fixture, "query-alias-1", false);
            checkInputDisabled(fixture, "query-alias-2", true);
            checkVisible(fixture, "query-output-badge-0", false);
            checkVisible(fixture, "query-output-badge-2", true);
        });

        it("should check the output query has no reorder or remove controls", () => {
            checkVisible(fixture, "move-down-query-2", false);
            checkVisible(fixture, "move-up-query-2", false);
            checkVisible(fixture, "remove-query-2", false);
        });

        it("should check moves that would displace the output query are disabled", () => {
            checkButtonDisabled(fixture, "move-up-query-0", true);
            checkButtonDisabled(fixture, "move-down-query-0", false);
            checkButtonDisabled(fixture, "move-up-query-1", false);
            checkButtonDisabled(fixture, "move-down-query-1", true);
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

    describe("with a single query", () => {
        it("should check a single query is the output and has no controls", async () => {
            render([{ alias: "", query: "select 1" }]);
            await fixture.whenStable();

            checkInputDisabled(fixture, "query-alias-0", true);
            checkVisible(fixture, "query-output-badge-0", true);
            checkVisible(fixture, "remove-query-0", false);
        });
    });
});
