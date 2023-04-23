import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EventTimeFieldComponent } from "./event-time-field.component";

describe("EventTimeFieldComponent", () => {
    let component: EventTimeFieldComponent;
    let fixture: ComponentFixture<EventTimeFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventTimeFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EventTimeFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
