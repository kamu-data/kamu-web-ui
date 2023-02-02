import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [MatTableModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicTableComponent);
        component = fixture.componentInstance;
        component.hasTableHeader = true;
        component.schemaFields = mockSchemaFields;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check column names", () => {
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
});
