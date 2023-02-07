import { mockSetWatermark } from "./../../mock.events";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetWatermarkEventComponent } from "./set-watermark-event.component";

describe("SetWatermarkEventComponent", () => {
    let component: SetWatermarkEventComponent;
    let fixture: ComponentFixture<SetWatermarkEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetWatermarkEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetWatermarkEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetWatermark;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
