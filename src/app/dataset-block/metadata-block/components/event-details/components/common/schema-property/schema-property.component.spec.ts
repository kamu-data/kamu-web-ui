import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SchemaPropertyComponent } from "./schema-property.component";
import { DynamicTableComponent } from "src/app/components/dynamic-table/dynamic-table.component";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("SchemaPropertyComponent", () => {
    let component: SchemaPropertyComponent;
    let fixture: ComponentFixture<SchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchemaPropertyComponent, DynamicTableComponent],
            imports: [MatTableModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SchemaPropertyComponent);
        component = fixture.componentInstance;
        component.data = ["id BIGINT"];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
