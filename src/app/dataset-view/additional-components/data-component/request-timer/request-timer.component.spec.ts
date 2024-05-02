import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RequestTimerComponent } from "./request-timer.component";

describe("RequestTimerComponent", () => {
    let component: RequestTimerComponent;
    let fixture: ComponentFixture<RequestTimerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RequestTimerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestTimerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
