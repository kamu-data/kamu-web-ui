import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EventTimePropertyComponent } from "./event-time-property.component";

describe("EventTimePropertyComponent", () => {
    let component: EventTimePropertyComponent;
    let fixture: ComponentFixture<EventTimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventTimePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EventTimePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
