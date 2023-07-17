import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TemporalTablesPropertyComponent } from "./temporal-tables-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("TemporalTablesPropertyComponent", () => {
    let component: TemporalTablesPropertyComponent;
    let fixture: ComponentFixture<TemporalTablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TemporalTablesPropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TemporalTablesPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
