import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SchemaPropertyComponent } from "./schema-property.component";

describe("SchemaPropertyComponent", () => {
    let component: SchemaPropertyComponent;
    let fixture: ComponentFixture<SchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchemaPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SchemaPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
