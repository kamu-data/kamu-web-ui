import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TimePropertyComponent } from "./time-property.component";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";

describe("TimePropertyComponent", () => {
    let component: TimePropertyComponent;
    let fixture: ComponentFixture<TimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimePropertyComponent],
            imports: [DisplayTimeModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TimePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
