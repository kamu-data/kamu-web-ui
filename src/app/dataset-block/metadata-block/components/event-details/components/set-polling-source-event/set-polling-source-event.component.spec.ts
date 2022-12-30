import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetPollinfSourceEvent } from "../../mock.events";

import { SetPollingSourceEventComponent } from "./set-polling-source-event.component";

describe("SetPollingSourceEventComponent", () => {
    let component: SetPollingSourceEventComponent;
    let fixture: ComponentFixture<SetPollingSourceEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetPollingSourceEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetPollingSourceEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetPollinfSourceEvent;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
