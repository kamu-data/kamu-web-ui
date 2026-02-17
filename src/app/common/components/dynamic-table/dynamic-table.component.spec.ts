/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { findElementByDataTestId, getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MarkdownModule } from "ngx-markdown";
import { provideToastr, ToastrService } from "ngx-toastr";

import { DynamicTableComponent } from "./dynamic-table.component";
import { MOCK_DATA_ROWS, MOCK_DATA_ROWS_SHOW_MORE_BADGE } from "./dynamic-table.mock";

describe("DynamicTableComponent", () => {
    let component: DynamicTableComponent;
    let fixture: ComponentFixture<DynamicTableComponent>;
    let ngbModalService: NgbModal;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicTableComponent, MarkdownModule.forRoot()],
            providers: [provideToastr()],
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicTableComponent);
        ngbModalService = TestBed.inject(NgbModal);
        toastService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        component.columnDescriptors = [
            { columnName: "offset" },
            { columnName: "op" },
            { columnName: "system_time" },
            { columnName: "block_time" },
        ];
        component.hasTableHeader = true;
        component.idTable = "idTable";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to copy cell content", () => {
        component.dataRows = MOCK_DATA_ROWS_SHOW_MORE_BADGE;
        component.columnDescriptors = [
            {
                columnName: "name",
            },
            {
                columnName: "type",
            },
            {
                columnName: "description",
            },
        ];
        fixture.detectChanges();
        const successToastServiceSpy = spyOn(toastService, "success");
        const cell0 = findElementByDataTestId(fixture, "column-name-type-0");
        cell0?.click();
        expect(successToastServiceSpy).toHaveBeenCalledWith("Copied");
    });

    it("should check column names", () => {
        fixture.detectChanges();
        const nodesSimpleChanges: SimpleChanges = {
            dataRows: {
                previousValue: undefined,
                currentValue: [],
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        component.ngOnChanges(nodesSimpleChanges);

        component.displayedColumns.forEach((item: string, index: number) => {
            const el = getElementByDataTestId(fixture, `column-header-name-${index}`);
            expect(el.textContent).toEqual(` ${item} `);
        });
    });

    it("should check table if schemaFields is empty", () => {
        component.columnDescriptors = [];
        fixture.detectChanges();
        expect(component.dataSource.data).toEqual([]);
    });

    it("should check column 'op' classes", () => {
        component.dataRows = MOCK_DATA_ROWS;
        fixture.detectChanges();

        const cell0 = findElementByDataTestId(fixture, "column-name-op-0");
        const cell1 = findElementByDataTestId(fixture, "column-name-op-1");
        const cell2 = findElementByDataTestId(fixture, "column-name-op-2");
        const cell3 = findElementByDataTestId(fixture, "column-name-op-3");
        expect(cell0?.classList.contains("primary-color")).toBe(true);
        expect(cell1?.classList.contains("error-color")).toBe(true);
        expect(cell2?.classList.contains("secondary-color")).toBe(true);
        expect(cell3?.classList.contains("secondary-color")).toBe(true);
    });

    it("The 'showMore' badge should be checked", () => {
        component.dataRows = MOCK_DATA_ROWS_SHOW_MORE_BADGE;
        component.columnDescriptors = [
            {
                columnName: "name",
            },
            {
                columnName: "type",
                showMoreBadge: {
                    extraElementKey: "extraKeys",
                },
            },
            {
                columnName: "description",
            },
        ];
        fixture.detectChanges();

        const showMoreBadge = findElementByDataTestId(fixture, "show-more-type-0");
        expect(showMoreBadge).toBeDefined();
    });

    it("The 'showInfo' tooltip should be checked", () => {
        component.dataRows = MOCK_DATA_ROWS_SHOW_MORE_BADGE;
        component.columnDescriptors = [
            {
                columnName: "name",
                showInfoBadge: {
                    extraElementKey: "description",
                },
            },
            {
                columnName: "type",
            },
        ];
        fixture.detectChanges();

        const showInfoIcon = findElementByDataTestId(fixture, "show-info-name-0");
        expect(showInfoIcon).toBeDefined();
    });

    it("The 'showMore' badge should open the modal window", () => {
        const ngbModalServiceSpy = spyOn(ngbModalService, "open").and.callThrough();
        component.dataRows = MOCK_DATA_ROWS_SHOW_MORE_BADGE;
        component.columnDescriptors = [
            {
                columnName: "name",
            },
            {
                columnName: "type",
                showMoreBadge: {
                    extraElementKey: "extraKeys",
                },
            },
            {
                columnName: "description",
            },
        ];
        fixture.detectChanges();

        const showMoreBadge = findElementByDataTestId(fixture, "show-more-type-0");
        showMoreBadge?.click();
        expect(ngbModalServiceSpy).toHaveBeenCalledTimes(1);
    });
});
