import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetLicense } from "../../mock.events";

import { SetLicenseEventComponent } from "./set-license-event.component";

describe("SetLicenseEventComponent", () => {
    let component: SetLicenseEventComponent;
    let fixture: ComponentFixture<SetLicenseEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetLicenseEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetLicenseEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetLicense;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
