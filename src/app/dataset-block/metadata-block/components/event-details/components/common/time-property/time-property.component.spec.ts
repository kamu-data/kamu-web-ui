import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TimePropertyComponent } from "./time-property.component";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("TimePropertyComponent", () => {
    let component: TimePropertyComponent;
    let fixture: ComponentFixture<TimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimePropertyComponent],
            imports: [DisplayTimeModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TimePropertyComponent);
        component = fixture.componentInstance;
        component.data = new Date("2021-10-03 12:00:00").toISOString();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
