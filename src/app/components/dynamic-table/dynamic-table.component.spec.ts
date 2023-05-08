import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableModule } from "@angular/material/table";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { DynamicTableComponent } from "./dynamic-table.component";

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
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check column names", () => {
        fixture.detectChanges();
        component.ngOnChanges();
        Object.keys(mockSchemaFields[0]).forEach(
            (item: string, index: number) => {
                const el = findElementByDataTestId(
                    fixture,
                    `column-name-${index}`,
                );
                expect(el.textContent).toEqual(` ${item} `);
            },
        );
    });

    it("should check table if schemaFields is empty", () => {
        component.schemaFields = [];
        fixture.detectChanges();
        expect(component.dataSource.data).toEqual([]);
        expect(component.displayedColumns).toEqual([]);
    });

    it("should check table if schemaFields is exist", () => {
        component.schemaFields = [
            { name: "testName", repetition: "testRepetiton", type: "testType" },
        ];
        component.dataRows = [];
        fixture.detectChanges();
        expect(component.dataSource.data).toBeDefined();
        expect(component.displayedColumns).toBeDefined();
    });
});
