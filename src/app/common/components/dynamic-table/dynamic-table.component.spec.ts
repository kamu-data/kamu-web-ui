import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material/table";
import { findElementByDataTestId, getElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { DynamicTableComponent } from "./dynamic-table.component";
import { MOCK_DATA_ROWS, MOCK_SCHEMA_FIELDS } from "./dynamic-table.mock";

describe("DynamicTableComponent", () => {
    let component: DynamicTableComponent;
    let fixture: ComponentFixture<DynamicTableComponent>;

    const mockSchemaFields = [
        {
            name: "offset",
            repetition: "OPTIONAL",
            type: "INT64",
        },
        { name: "system_time", repetition: "REQUIRED", type: "INT96" },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DynamicTableComponent],
            imports: [MatTableModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicTableComponent);
        component = fixture.componentInstance;
        component.schemaFields = mockSchemaFields;
        component.hasTableHeader = true;
        component.idTable = "idTable";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check column names", () => {
        fixture.detectChanges();
        component.ngOnChanges();
        Object.keys(mockSchemaFields[0]).forEach((item: string, index: number) => {
            const el = getElementByDataTestId(fixture, `column-header-name-${index}`);
            expect(el.textContent).toEqual(` ${item} `);
        });
    });

    it("should check table if schemaFields is empty", () => {
        component.schemaFields = [];
        fixture.detectChanges();
        expect(component.dataSource.data).toEqual([]);
        expect(component.displayedColumns).toEqual([]);
    });

    it("should check table if schemaFields is exist", () => {
        component.schemaFields = [{ name: "testName", repetition: "testRepetition", type: "testType" }];
        component.dataRows = [];
        fixture.detectChanges();
        expect(component.dataSource.data).toBeDefined();
        expect(component.displayedColumns).toBeDefined();
    });

    it("should check column 'op' classes", () => {
        component.dataRows = MOCK_DATA_ROWS;
        component.schemaFields = MOCK_SCHEMA_FIELDS;
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
});
