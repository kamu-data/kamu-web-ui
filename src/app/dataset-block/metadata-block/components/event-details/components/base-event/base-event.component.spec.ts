import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetPollingSourceEvent } from "../../mock.events";
import { BaseEventComponent } from "./base-event.component";

describe("BaseEventComponent", () => {
    let component: BaseEventComponent;
    let fixture: ComponentFixture<BaseEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BaseEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(BaseEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetPollingSourceEvent;
        component.eventSections = [{ title: "test", rows: [] }];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
