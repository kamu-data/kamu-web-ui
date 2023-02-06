import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { mockSetInfo } from "./../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetInfoEventComponent } from "./set-info-event.component";

describe("SetInfoEventComponent", () => {
    let component: SetInfoEventComponent;
    let fixture: ComponentFixture<SetInfoEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetInfoEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetInfoEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
