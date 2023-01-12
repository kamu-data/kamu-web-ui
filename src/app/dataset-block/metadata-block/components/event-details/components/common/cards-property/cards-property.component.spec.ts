import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CardsPropertyComponent } from "./cards-property.component";

describe("CardsPropertyComponent", () => {
    let component: CardsPropertyComponent;
    let fixture: ComponentFixture<CardsPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CardsPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardsPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
