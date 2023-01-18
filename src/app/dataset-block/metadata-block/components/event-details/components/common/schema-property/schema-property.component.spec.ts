import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SchemaPropertyComponent } from "./schema-property.component";

describe("SchemaPropertyComponent", () => {
    let component: SchemaPropertyComponent;
    let fixture: ComponentFixture<SchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchemaPropertyComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
