import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UnsupportedPropertyComponent } from "./unsupported-property.component";

describe("UnsupportedPropertyComponent", () => {
    let component: UnsupportedPropertyComponent;
    let fixture: ComponentFixture<UnsupportedPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UnsupportedPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UnsupportedPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
